export default async function handler(req, res) {
  if (req.method === "POST") {
    // Aqui você vai validar o evento do Stripe
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      // Aqui você autoriza o acesso do usuário
      console.log("Pagamento confirmado. Liberar acesso.");
    }

    res.status(200).send("ok");
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
