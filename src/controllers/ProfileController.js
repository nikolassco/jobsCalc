const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        return res.render("profile", { profile: await Profile.get() })
    },

    async update(req, res) {
       // req.body para pegar os dados
       const data = req.body

       // definir uantas semanas tem num ano: 52
       const weeksPerYear = 52
       // remover as semanas de ferias do ano
       const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
       // uantas hrs p semana to trabalhando
       // total de hrs trabalhadas no mes 
        const weekTotalHours = data["hours-per-day"] * data[ "days-per-week"]

        //horas tabalhadas no mes
        const monthlyTotalHours = weekTotalHours * weeksPerMonth

        // valor da minha hora
        const valueHour = data["monthly-budget"] / monthlyTotalHours
        
        await Profile.update({
            ...await Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile')
    },
}