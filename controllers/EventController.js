const router = require("express").Router();
const Event = require("../models/Event");
const yup = require("yup");
const checkToken = require("../utils/checkToken")

router.post("/new-event/:id", checkToken, async (req, res) => {
  try {
    const { title, date_of_event, init_time, end_time, description, created_at } = req.body;

    const eventSchema = yup.object().shape({
      title: yup.string().required('O campo título é obrigatório'),
      date_of_event: yup.date().required("A data do evento é obrigatória!").typeError('Por favor, insira uma data válida no formato YYYY-MM-DD').min(new Date(), "Não são aceitas datas no passado!"),
      init_time: yup
        .string()
        .required('O campo horário de início é obrigatório')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário de início inválido'),
      end_time: yup
        .string()
        .required('O campo horário de término é obrigatório')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário de término inválido')
        .test('is-valid-end-time', 'O horário de término deve ser maior que o de início', function (value) {
          const initTime = this.parent.init_time;
          if (!initTime || !value) return true; 
          return value > initTime;
        }),
      description: yup.string(),
      created_at: yup.date().default(new Date())
    });

    await eventSchema.validate(req.body, { abortEarly: false });

    const newEvent = new Event({
      title,
      date_of_event,
      init_time,
      end_time,
      description,
      created_at
    });

    await newEvent.save();

    return res.status(201).send({
      mensagem: "Evento criado com sucesso!",
      newEvent,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = error.errors || [];
      return res.status(500).send({
        errors,
      });
    } else {
      console.log(error)
      return res.status(500).send({
        mensagem: "Erro ao cadastrar evento!",
      });
    }
  }
});

module.exports = router;
