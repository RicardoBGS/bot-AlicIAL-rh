const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const subMenuNominaTexto = 
  "💰 *Consultas sobre Nómina / Pagos* 💵 \n\n" +
  "Selecciona una opción escribiendo el número correspondiente: \n\n" +
  "*1*. 📅 ¿Cuándo se deposita la nómina?\n" +
  "*2*. 💳 ¿Dónde consulto mis recibos de nómina?\n" +
  "*3*. ❓ Tengo un problema o dudas con mi pago\n" +
  "*4*. 🔙 Volver al menú principal";

const flowNomina = addKeyword(["/^nómina$/i", "/^pagos$/i"])
  .addAnswer(subMenuNominaTexto, { capture: true }, async (ctx, { flowDynamic, gotoFlow, state }) => {
    const opcion = ctx.body.trim();

    switch (opcion) {
      case "1":
        return await flowDynamic(
          "📅 *La nómina se deposita cada viernes*. En caso de días festivos, puede adelantarse. Si tienes dudas sobre fechas específicas, escribe un mensaje personalizado a *Guillermo Moreno*: 📲 +52 442 343 3075.\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );
      case "2":
        return await flowDynamic(
          "💳 *Tus recibos de nómina se envían automáticamente* al correo electrónico que registraste al ingresar a BGS TECHNIC. 📨\n\n" +
          "📬 Si no los encuentras en tu bandeja de entrada, revisa también la carpeta de *SPAM* o *No deseados*.\n\n" +
          "Si aún así no aparecen, envía tu correo y nombre completo al *WhatsApp de RH: +52 442 343 3075* para que actualicen tus datos.\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );
      case "3":
        await state.update({ ultimaOpcionNomina: "3" }); 
        return await flowDynamic(
          "⚠️ *Lamentamos el inconveniente*. Por favor, escribe los detalles de tu problema relacionado con tu pago. 💬"
        );
      case "4":
        return gotoFlow(flowPrincipal);
      default:
        return await flowDynamic("❌ Opción no válida. Por favor, selecciona del 1 al 4. 🧾");
    }
  })

.addAction({ capture: true }, async (ctx, { provider, flowDynamic, state }) => {
  const nombre = ctx.pushName || "Empleado";
  const telefono = ctx.from || "Desconocido";
  const mensaje = String(ctx.body || "");

  const ultimaOpcionNomina = await state.get("ultimaOpcionNomina");
  if (ultimaOpcionNomina !== "3") return;

  const mensajeRH = 
    `📥 *Problema de nómina reportado desde el submenú del bot*\n` +
    `👤 Nombre: *${nombre}*\n📱 Número: ${telefono}\n\n💬 Detalles del problema:\n${mensaje}`;

  // 🛠️ USAMOS sendText PARA EVITAR EL ERROR
  await provider.sendText("5214423433075@s.whatsapp.net", mensajeRH);

  await state.clear();

  return await flowDynamic(
    "✅ Hemos enviado tu mensaje al área de Recursos Humanos. Te contactarán pronto. 📩\n\n" +
    "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
  );
});


const subMenuPermisosTexto =
  "📆 *Consultas sobre Permisos / Faltas y Asistencia* 📋\n\n" +
  "Selecciona una opción escribiendo el número correspondiente:\n\n" +
  "*1*. 📝 ¿Cómo solicito un permiso?\n" +
  "*2*. ⏰ ¿Qué pasa si llego tarde?\n" +
  "*3*. ❌ ¿Qué hago si falto al trabajo?\n" +
  "*4*. 🤔 ¿Cuál es la diferencia entre falta justificada e injustificada?\n" +
  "*5*. 🔙 Volver al menú principal";
  

const flowPermisos = addKeyword(["/^permisos$/i", "/^faltas$/i", "/^asistencia$/i"])
  .addAnswer(subMenuPermisosTexto, { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const opcion = ctx.body.trim();

    switch (opcion) {
    case "1":
  return await flowDynamic([
    {
      body: "📌 *Guía rápida para solicitar un permiso:*\n\n🖼️ A continuación te muestro una imagen con el proceso paso a paso 👆🏻",
      media: "https://dl.dropboxusercontent.com/scl/fi/9c7jvxhic4uinsn5kifgp/PERMISOS-RRHH.jpg?rlkey=30qdr51t37uyv9k7rclabwrj1&st=zulq6h86"
    },
    {
      body: "📮 *Para solicitar un permiso*, debes enviar tu solicitud por escrito al WhatsApp del coordinador de RH: +52 442 343 3075. 💬\n\n🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
    }
  ]);

    case "2":
        return await flowDynamic(
          "⏰ *Si llegas tarde, te pedimos que avises lo antes posible a tu jefe directo y al área de Recursos Humanos*.\n\n" +
          " *📌 Las llegadas tarde constantes pueden afectar tu puntualidad y ser consideradas como medidas disciplinarias, según el reglamento interno. Si hubo un imprevisto importante, por favor explícalo para que podamos tomarlo en cuenta. Lo importante es que haya comunicación y respeto al horario de entrada.*\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );  
    case "3":
        return await flowDynamic(
          "❌ *Si no puedes asistir al trabajo, notifica lo antes posible a tu jefe directo y al área de Recursos Humanos +52 442 343 3075*. En caso de incapacidad, recuerda enviar el comprobante oficial. 📄\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        ); 
    case "4":
        return await flowDynamic([
          {
      body: "📝 *Diferencia entre falta justificada y falta injustificada:*👆🏻",
      media: "https://dl.dropboxusercontent.com/scl/fi/cpu65tk8hnvf5w8f27xtp/DIFERENCIA-DE-FALTA-JUSTIFICADA-E-INJUSTIFICADA.jpg?rlkey=inqq4ru6udcpt2pzz7v1tt4pj"
    },
    {
      body: "📌 *Ambas faltas se descuentan del salario, pero tienen consecuencias distintas*.\n\n🔁 Puedes volver al menú escribiendo *MENU* 🏠"
    }
  ]);
      case "5":
        return gotoFlow(flowPrincipal);
      default:
        return await flowDynamic(
          "❌ *Opción no válida.* Por favor, responde con un número del 1 al 4. 📲"
        );
    }
  });

const subMenuIncapacidadesTexto =
  "🤒 *Consultas sobre Incapacidades* 🏥\n\n" +
  "Selecciona una opción escribiendo el número correspondiente:\n\n" +
  "*1*. 🏥 ¿Qué hago si estoy enfermo y necesito incapacidad del IMSS?\n" +
  "*2*. 📩 ¿A dónde debo enviar mi comprobante?\n" +
  "*3*. ❌ ¿Qué pasa si no notifico mi incapacidad?\n" +
  "*4*. 📋 Qué debo y qué NO debo hacer ante una incapacidad\n" +
  "*5*. 🔙 Volver al menú principal";

const flowIncapacidades = addKeyword(["/^incapacidades$/i", "/^incapacidad$/i"])
  .addAnswer(subMenuIncapacidadesTexto, { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const opcion = ctx.body.trim();  

    switch (opcion) {
case "1":
  return await flowDynamic([
    {
      body: "🩺 *Guía rápida: ¿Qué hacer si estás enfermo y necesitas una incapacidad del IMSS?*👆🏻",
      media: "https://dl.dropboxusercontent.com/scl/fi/6kx37zifc7e9hfa7j8fxo/GUIA-IMSS.jpg?rlkey=qkw14ku5kfh1hl8cjisbuyom3&st=y339z9ul"
    },
    {
      body: "🔁 Puedes regresar al menú principal escribiendo la palabra *MENU* 🏠"
    }
  ]);

    case "2":
        return await flowDynamic(
          "📩 *Tu comprobante de incapacidad* debe enviarse al área de Recursos Humanos lo antes posible al WhatsApp +52 442 343 3075 con una foto y colocando tu nombre completo. 💬\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );   
    case "3":
        return await flowDynamic(
          "❌ *No notificar tu incapacidad a tiempo* puede ocasionar descuentos o reportes en tu historial laboral. Por favor, informa cualquier ausencia a tu jefe directo de forma inmediata. 📌\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );
     case "4":
        return await flowDynamic([
          {
            body: "📋 *Lo que SÍ y lo que NO debes hacer ante una incapacidad.* Revisa esta mini guía visual 👆🏻",
            media: "https://www.dropbox.com/scl/fi/t4ifygmakltpzkfr66v4g/QUE-HACER-Y-QUE-NO-HACER-ANTE-UNA-INCAPACIDAD.jpg?rlkey=p3enafc0gxzt9mpnkfxo1w2py&raw=1"
          },
          {
            body: "🔁 Puedes regresar al menú principal escribiendo la palabra *MENU* 🏠"
          }
        ]);    
    case "5":
        return gotoFlow(flowPrincipal);
      default:
        return await flowDynamic(
          "❌ *Opción no válida.* Por favor, responde con un número del 1 al 4. 📲"
        );
    }
  });    

const subMenuVacacionesTexto =
  "🏖️ *Consultas sobre Vacaciones* 📅\n\n" +
  "Selecciona una opción escribiendo el número correspondiente:\n\n" +
  "*1*. 📋 ¿Cómo solicito vacaciones?\n" +
  "*2*. 📆 ¿Cuántos días de vacaciones me quedan?\n" +
  "*3*. 📌 Políticas generales sobre vacaciones\n" +
  "*4*. 🔙 Volver al menú principal";

const flowVacaciones = addKeyword(["/^vacaciones$/i", "/^vacación$/i"])
  .addAnswer(subMenuVacacionesTexto, { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const opcion = ctx.body.trim();

    switch (opcion) {
    case "1":
        return await flowDynamic(
          "📋 *Las vacaciones se solicitan a través del siguiente formulario:* \n\n" +
          "🌐 https://form.jotform.com/calidadyservicio.bgs/solicitud-de-vacaciones\n\n" +
          "📲 Una vez que envíes tu solicitud, tu jefe directo evaluará si es posible otorgar los días solicitados.\n\n" +
          "📬 *Recibirás una respuesta directamente por WhatsApp* al número que hayas registrado en el formulario. ✅\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );
    case "2":
        return await flowDynamic(
          "📆 *Para conocer cuántos días de vacaciones te quedan*, puedes consultarlo directamente con el coordinador de RH mediante WhatsApp +52 442 343 3075 identifícate con tu nombre y con gusto atenderá tu solicitud. \n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );
    case "3":
        return await flowDynamic(
          "📌 *Políticas Generales:*\n\n" +
          "- Debes cumplir al menos un año laboral para gozar de vacaciones.\n" +
          "- Las vacaciones no se acumulan más de 2 periodos.\n" +
          "- Se recomienda solicitarlas con al menos 5 días de anticipación.\n\n" +
          "- *Ninguna vacación es automática*.\n\n" +
          "🔁 Puedes regresar al menú escribiendo la palabra *MENU* 🏠"
        );
      case "4":
        return gotoFlow(flowPrincipal);
      default:
        return await flowDynamic(
          "❌ *Opción no válida.* Por favor, responde con un número del 1 al 3. 📲"
        );
    }
  });      

const subMenuComedorTexto =
  "🍽️ *Consultas sobre el Comedor* 🧾\n\n" +
  "Selecciona una opción escribiendo el número correspondiente:\n\n" +
  "*1*. 📌 Políticas y funcionamiento del comedor\n" +
  "*2*. 📝 ¿Cómo me registro en el comedor?\n" +
  "*3*. 🔙 Volver al menú principal";

const flowComedor = addKeyword(["/^comedor$/i", "/^menu comedor$/i"])
  .addAnswer(subMenuComedorTexto, { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
    const opcion = ctx.body.trim();
    
    switch (opcion) {
      case "1":
        return await flowDynamic([
    {
      body: "📌 *Consulta aquí las políticas y funcionamiento del servicio de comedor en BGS:*",
      media: "https://dl.dropboxusercontent.com/scl/fi/rwp5d43sf4v3fqqon1h5r/POLITICAS-COMEDOR-BGS.jpg?rlkey=3yoz6wy2vnshnhz6h9gj2jea5&st=7562iv49&dl=0"
    },
    {
      body: "🔁 Puedes regresar al *menú principal* escribiendo la palabra *MENU* 🏠.\n\n👩‍💼 Si tienes más dudas, RH está para ayudarte. 💬"
    }
  ]);
      case "2":
  return await flowDynamic(
    "📝 *Para registrarte en el comedor*, completa este formulario:\n👉 https://form.jotform.com/calidadyservicio.bgs/comedor-bgs\n\n" +
    "📌 *Importante:* El registro debe realizarse *dentro de los dos días* posteriores a la publicación de la lista del comedor 🗓️⏰.\n" +
    "❌ Después de ese periodo, ya *no es posible registrarse*.\n\n" +
    "📲 Si tienes alguna duda, puedes contactar directamente al coordinador de RH al WhatsApp: *+52 442 343 3075*. 💬\n\n" +
    "🔁 Puedes regresar al menú principal escribiendo la palabra *MENU* 🏠"
  );
      case "3":
        return gotoFlow(flowPrincipal);

      default:
        return await flowDynamic(
          "❌ *Opción no válida.* Por favor, responde con un número del 1 al 3. 📲"
        );
    }
  });
  
  const flowHablarConRH = addKeyword("💬 Hablar con RH")
  .addAnswer("📝 Por favor, escribe tu duda o comentario para RH.\n\n✍️ Escribe tu mensaje a continuación.")

  .addAction({ capture: true }, async (ctx, { provider, flowDynamic }) => {
    const nombre = ctx.pushName || "Empleado";
    const mensaje = ctx.body;

    await provider.sendMessage("5214423433075@s.whatsapp.net", 
      `📥 *Nueva solicitud para RH*\n👤 Nombre: *${nombre}*\n📱 Número: ${ctx.from}\n\n💬 Mensaje:\n${mensaje}`, 
      {} 
    );

    return await flowDynamic("✅ Gracias. Tu mensaje fue enviado a RH. Te contactarán lo antes posible. 📬\n\n🔁 Puedes regresar al *menú principal* escribiendo la palabra *MENU* 🏠.");
  });

  const flowBuzonQuejas = addKeyword("📮 Buzón de Quejas")
  .addAnswer([
    "📮 *Buzón de Quejas y Sugerencias BGS TECHNIC*",
    "🧰 Queremos escucharte. Este buzón es confidencial y está diseñado para que compartas cualquier situación, idea o propuesta para mejorar nuestro entorno de trabajo.",
    "📝 Completa el formulario en el siguiente enlace:"
  ])
  .addAnswer(
    "👉 https://form.jotform.com/calidadyservicio.bgs/buzon-de-quejas-y-sugerencias-bgs"
  )
  .addAnswer(
    "📌 Recuerda: puedes dejar tu mensaje *de forma anónima o identificándote*, como tú lo prefieras.\n\n🔁 Para regresar al *menú principal*, escribe la palabra *MENU* 🏠."
  );

const flowPrincipal = addKeyword(['hola', 'ole', 'alo', "menu", "Menú", "MENU"])
    .addAnswer("🙋‍♀️ ¡Hola! *Soy AlicIA, tu asistente virtual de Recursos Humanos en BGS TECHNIC*. Por favor, selecciona una opción escribiendo la letra correspondiente:")
    .addAnswer(
        [
            '*1*. 💰 Nómina / pagos 💵',
            '*2*. 📆 Permisos / Faltas y Asistencia 📋',
            '*3*. 🤒 Incapacidades 🏥',
            '*4*. 🏖️ Dudas de Vacaciones 📅',
            '*5*. 🍽️ Dudas de Comedor 🧾',
            '*6*. 🗣️ Otras dudas. Enviar un mensaje directo al chat de RH 💬',
            '*7*. 📮 Buzón de quejas',  
        ],
     { capture: true },
     async (ctx, { gotoFlow, flowDynamic }) => {
    const opcion = ctx.body.trim();
    if (opcion === "1") return gotoFlow(flowNomina);
    if (opcion === "2") return gotoFlow(flowPermisos);
    if (opcion === "3") return gotoFlow(flowIncapacidades);
    if (opcion === "4") return gotoFlow(flowVacaciones);
    if (opcion === "5") return gotoFlow(flowComedor);
    if (opcion === "6") return gotoFlow(flowHablarConRH);
    if (opcion === "7") return gotoFlow(flowBuzonQuejas);
    return await flowDynamic(
        "🙋‍♀️ Ups, lo siento... Esa opción no está disponible o no entendí tu respuesta. 😅\n\n"+
        "🔁 Puedes volver al *Menú Principal* escribiendo la palabra *MENU* 🏠\n"+
        "📌 O bien, elige una opción válida del menú actual para continuar 💬\n\n"+
        "👩‍💼 *Estoy aquí para ayudarte en todo lo relacionado con Recursos Humanos.* 💙"
            );
        }
    );

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowNomina, flowPermisos, flowIncapacidades, flowVacaciones, flowComedor, flowHablarConRH, flowBuzonQuejas,])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
