const router = require("express").Router()
const User = require("../models/User")
const yup = require("yup")
const bcrypt = require("bcryptjs")
const captureErrorYup = require("../utils/captureErrorYup")
const jwt = require("jsonwebtoken")

router.post("/new-user", async (req, res)=>{
    try{
        const {full_name, email, password, repeat_password} = req.body

        const userSchema = yup.object().shape({
            full_name: yup.string().required("O nome completo é obrigatório!"),
            email: yup.string().email("Digite um email válido!").required("O email é obrigatório!"),
            password: yup.string().required("A senha é obrigatória!").min(6, "A senha deve ter no mínimo 6 caracteres!").max(20, "A senha deve ter no máximo 20 caracteres!"),
            repeat_password: yup.string().oneOf([ref= password, null], "As senhas devem ser iguais!").required("O campo repita a senha é obrigatório!")
        })
    
        await userSchema.validate(req.body, {abortEarly: false})
    
        const checkEmail = await User.findOne({email})
    
        if(checkEmail){
            return res.status(422).send({
                mensagem: "Esse email já foi cadastrado!"
            })
        }
    
        const passwordHash = await bcrypt.hash(password, 10)
    
        const newUser = new User({
            full_name,
            email,
            password: passwordHash
        })
    
        await newUser.save()
    
        return res.status(201).send({
            mensagem: "Usuário cadastrado com sucesso!"
        })
    }catch(error){
        if(error instanceof yup.ValidationError){
            const errors = [captureErrorYup(error)]

            return res.status(422).send({
                mensagem: "Erro ao cadastrar usuário!",
                errors
            })
        }else{
            console.log(error)
            return res.status(500).send({
                mensagem: "Erro ao cadastrar usuário!"
            })
        }
    }
})

router.post("/login", async (req, res)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        const comparePass = await bcrypt.compare(password, user.password)

        if(!email || !password){
            return res.status(400).send({
                mensagem: "Email e senha são obrigatórios!"
            })
        }else if(!user || !comparePass){
            return res.status(400).send({
                mensagem: "Email ou senha estão incorretos!"
            })
        }

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret)

        return res.status(200).send({
            mensagem: "Login efetuado com sucesso!",
            token,
            id: user._id
        })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            mensagem: "Erro ao efetuar o login!"
        })
    }   
})

module.exports = router