const supabase =
  require("./supabase");

async function getSession(
  phone
) {

  const {
    data,
    error
  } = await supabase
    .from("sessions")
    .select("*")
    .eq("phone", phone)
    .single();

  if (error || !data) {

    return {
      step: "brand",
      data: {}
    };
  }

  return {
    step: data.step,
    data: data.data || {}
  };
}

async function saveSession(
  phone,
  session
) {

  const {
    error
  } = await supabase
    .from("sessions")
    .upsert(
  [
    {
      phone,

      step:
        session.step,

      data:
        session.data,

      updated_at:
        new Date()
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

async function resetSession(
  phone
) {

  await saveSession(
    phone,
    {
      step: "brand",
      data: {}
    }
  );
}

module.exports = {
  getSession,
  saveSession,
  resetSession
};