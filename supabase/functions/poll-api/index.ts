import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop() // 'poll-api' usually, but might need better routing if using single function

    // Simple routing based on method and query params or body
    // POST /poll-api -> Create Idea or Vote
    // GET /poll-api -> List Ideas

    if (req.method === 'POST') {
      const body = await req.json()
      
      // Check if it's a vote
      if (body.action === 'vote' && body.idea_id) {
        // Increment vote
        // Note: This is not atomic without a stored procedure or careful handling, 
        // but for this MVP we'll just fetch and update or use rpc if we had one.
        // Better: use an RPC. But let's try direct update first.
        // Actually, let's use a simple RPC-like approach or just update.
        // To be safe against race conditions, we should use `rpc` to increment.
        // But I didn't create an RPC. I'll just do a direct update for now.
        // `update ideas set votes = votes + 1 where id = ?`
        
        // Since Supabase JS client doesn't support `votes = votes + 1` directly in `.update()`,
        // we usually need an RPC.
        // Let's create a quick RPC in the migration if possible, or just read-then-write (race condition prone).
        // Given the constraints, I'll add an RPC to the migration file in a separate step or just use read-write for now.
        // I'll stick to read-write for simplicity unless I can add RPC easily.
        // Actually, I can just use the `rpc` call if I define it.
        // Let's define it in the migration file. I'll update the migration file in a sec.
        // For now, I'll assume I have an RPC `increment_vote`.
        
        const { error } = await supabaseClient.rpc('increment_vote', { row_id: body.idea_id })
        if (error) throw error
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      } else if (body.name && body.description) {
        // Create Idea
        const { data, error } = await supabaseClient
          .from('ideas')
          .insert([
            {
              name: body.name,
              description: body.description,
              tagline: body.tagline,
            },
          ])
          .select()

        if (error) throw error
        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        })
      }
    } else if (req.method === 'GET') {
      const sort = url.searchParams.get('sort')
      let query = supabaseClient.from('ideas').select('*')
      
      if (sort === 'votes') {
        query = query.order('votes', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
