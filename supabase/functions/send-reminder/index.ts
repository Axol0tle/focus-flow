import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    // 1. Grab the data sent to this function (the user's OneSignal ID and the Task name)
    const { onesignal_id, task_text } = await req.json()

    // 2. Get our secret keys from Supabase's secure vault
    const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID')
    const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY')

    // 3. Make the official request to OneSignal to send the push notification
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_subscription_ids: [onesignal_id],
        headings: { en: "FocusFlow Reminder" },
        contents: { en: `It is time to work on: ${task_text}` }
      })
    })

    const data = await response.json()
    
    // 4. Return a success message!
    return new Response(JSON.stringify({ success: true, onesignal_response: data }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    })
  }
})
