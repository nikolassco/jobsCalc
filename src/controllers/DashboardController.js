const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        const jobs = await Job.get();
        const profile = await Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        // total de hrs de cada job em progress
        let jobTotalHours = 0

        // map cria um array novo
        const updatedJobs = jobs.map((job) => {
            //ajustes no job
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress';

            // somando a uantidade de status
            // pegando o objeto e passando o status p ele e somando mais um pra cada igual  tiver no status e no objeto
            // esta em map por isso passa pelos dois
            statusCount[status] += 1;

            // total de hrs de cada job em progress e dentro do map olha item a item
            jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours

            // forma melhor de entender o ternario de cima
            /*if (status == 'progress') {
                jobTotalHours += Number(job['daily-hours'])
            }*/

            // ...job adiciona ao job mais coisas
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }
        })

        // uantidade de hrs trabalhar menos uantidade de hrs/dia em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
    }
}