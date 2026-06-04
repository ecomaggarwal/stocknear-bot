const supabase =
  require("./supabase");

async function getSession(phone) {

  const { data, error } =
    await supabase
      .from("sessions")
      .select("*")
      .eq("phone", phone)
      .single();

  if (error || !data) {
    return {
      step: "zone_select",
      data: {},
      location: null
    };
  }

  return {
    step: data.step,
    data: data.data || {},
    location: data.location || null
  };
}

async function saveSession(phone, session) {

  const { error } =
    await supabase
      .from("sessions")
      .upsert(
        [
          {
            phone,
            step: session.step,
            data: session.data,
            location: session.location || null,
            updated_at: new Date()
          }
        ],
        {
          onConflict: "phone"
        }
      );

  if (error) {
    console.log(
      "Session save error:",
      error.message
    );
  }
}

async function resetSession(phone) {
  await saveSession(phone, {
    step: "zone_select",
    data: {},
    location: null
  });
}

module.exports = {
  getSession,
  saveSession,
  resetSession
};