import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript"
import { slow, suite, test, timeout } from "mocha-typescript"
import mongoose = require("mongoose")
import XLSX = require("xlsx")
import PhLogger from "../../src/logger/phLogger"
import Evaluation from "../../src/models/Evaluation"
import Hospital from "../../src/models/Hospital"
import Preset from "../../src/models/Preset"
import Product from "../../src/models/Product"
import Proposal from "../../src/models/Proposal"
import Report from "../../src/models/Report"
import Requirement from "../../src/models/Requirement"
import Resource from "../../src/models/Resource"
import UsableProposal from "../../src/models/UsableProposal"
import Validation from "../../src/models/Validation"

@suite(timeout(1000 * 60), slow(1000))
class ExcelDataInput {

    public static before() {
        PhLogger.info(`before starting the test`)
        mongoose.connect("mongodb://192.168.100.176:27017/pharbers-ntm-client-4")
    }

    public static after() {
        PhLogger.info(`after starting the test`)
        mongoose.disconnect()
    }

    @test public async excelModelData() {
        PhLogger.info(`start input data with excel`)
        const file = "test/data/tm.xlsx"
        await this.loadExcelData(file)
    }

    @test public async ucbModelData() {
        PhLogger.info(`start input data with excel`)
        const file = "test/data/ucb.xlsx"
        await this.loadExcelData(file)
    }

    public async loadExcelData(file: string) {
        const wb = XLSX.readFile(file)

        /**
         * 1. read hospital data in the excel
         * and collect all the insertion ids
         */
        let hosps: Hospital[] = []
        {
            PhLogger.info(`1. read hospital data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Hospital, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Hospital()
            hosps = await Promise.all(data.map ( (x) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
                return th.getModel().create(jsonConvert.deserializeObject(x, Hospital))
            }))
        }

        /**
         * 2. read products data in the excel
         * and colleect all the insertion ids
         */
        let products: Product[] = []
        {
            PhLogger.info(`2. read product data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Product, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Product()
            products = await Promise.all(data.map ( (x) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
                return th.getModel().create(jsonConvert.deserializeObject(x, Product))
            }))
        }

        /**
         * 3. read resources data in the excel
         * and colleect all the insertion ids
         */
        let resources: Resource[] = []
        {
            PhLogger.info(`3. read resource data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Resource, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Resource()
            resources = await Promise.all(data.map ( (x) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
                return th.getModel().create(jsonConvert.deserializeObject(x, Resource))
            }))
        }

        /**
         * 4. read evaluation data in the excel
         * and colleect all the insertion ids
         */
        let evls: Evaluation[] = []
        {
            PhLogger.info(`4. read evaluation data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Evaluation, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Evaluation()
            evls = await Promise.all(data.map ( (x) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
                return th.getModel().create(jsonConvert.deserializeObject(x, Evaluation))
            }))
        }

        /**
         * 5. read requirement data in the excel
         * and colleect all the insertion ids
         */
        let reqs: Requirement[] = []
        {
            PhLogger.info(`5. read requirement data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Requirement, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Requirement()
            reqs = await Promise.all(data.map ( (x) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
                return th.getModel().create(jsonConvert.deserializeObject(x, Requirement))
            }))
        }

        /**
         * 10. read proposal data in the excel
         * and colleect all the insertion ids
         */
        let fp: Proposal
        {
            PhLogger.info(`10. read proposal data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Proposal, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Proposal()
            const pls = await Promise.all(data.map ( async (x) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null
                const proposal = jsonConvert.deserializeObject(x, Proposal)
                proposal.targets = hosps
                proposal.products = products
                // proposal.presets = presets
                proposal.resources = resources
                proposal.evaluations = evls
                proposal.quota = reqs[0]

                const validation = new Validation()
                validation.inputType = "managementTimeInputType#Number*"
                                     + "businessBudgetInputType#Number*"
                                     + "businessSalesTargetInputType#Number*"
                                     + "businessMeetingPlacesInputType#Number"
                validation.maxValue = "managementMaxTime#100*"
                                    + "managementMaxActionPoint#5*"
                                    + "businessMaxBudget#200000*"
                                    + "businessMaxSalesTarget#3700000*"
                                    + "businessMaxMeetingPlaces#6"

                const v = await validation.getModel().create(validation)
                proposal.validation = v

                fp = await th.getModel().create(proposal)
                const ups = new UsableProposal()
                ups.accountId = "5cc3fb57ceb3c45854b80e57"
                ups.proposal = fp
                ups.getModel().create(ups)
            }))
        }

        /**
         * 9. read preset data in the excel
         * and colleect all the insertion ids
         */
        // let presets: Preset[] = []
        {
            PhLogger.info(`9. read preset data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Preset, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Preset()
            await Promise.all(data.map ( (x: any) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null

                const item = jsonConvert.deserializeObject(x, Preset)
                if (item.category & 1 /*PresetCategory.Business*/) {
                    const hospName: string = x.hospital
                    const productName: string = x.product
                    const oh = hosps.find((y) => y.name === hospName)
                    const op = products.find((y) => y.name === productName)
                    item.hospital = oh
                    item.product = op
                    item.resource = null
                }

                if (item.category & 2 /*PresetCategory.Resource*/) {
                    const resName = x.resource
                    const or = resources.find((y) => y.name === resName)
                    item.hospital = null
                    item.product = null
                    item.resource = or
                }

                if (item.category & 4 /*PresetCategory.Quota*/) {
                    const productName: string = x.product
                    const op = products.find((y) => y.name === productName)
                    item.hospital = null
                    item.product = op
                    item.resource = null
                }

                if (item.category & 8 /*PresetCategory.Protental*/) {
                    const hospName: string = x.hospital
                    const productName: string = x.product
                    const op = products.find((y) => y.name === productName)
                    const oh = hosps.find((y) => y.name === hospName)
                    item.hospital = oh
                    item.product = op
                    item.resource = null
                }

                if (item.category & 16 /*PresetCategory.Share*/) {
                    const productName: string = x.product
                    const op = products.find((y) => y.name === productName)
                    item.hospital = null
                    item.product = op
                    item.resource = null
                }
                item.proposal = fp
                // @ts-ignore
                item.proposalId = fp._id.toString()
                return th.getModel().create(item)
            }))
        }

        /**
         * 8. read report data in the excel
         * and colleect all the insertion ids
         */
        // let presets: Preset[] = []
        {
            PhLogger.info(`8. read report data in the excel`)

            const data = XLSX.utils.sheet_to_json(wb.Sheets.Report, { header: 2, defval: "" })

            const jsonConvert: JsonConvert = new JsonConvert()
            const th = new Report()
            await Promise.all(data.map ( (x: any) => {
                // jsonConvert.operationMode = OperationMode.LOGGING // print some debug data
                jsonConvert.ignorePrimitiveChecks = true // don't allow assigning number to string etc.
                jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL // never allow null

                const item = jsonConvert.deserializeObject(x, Report)
                if (item.category === "Hospital") {
                    const hospName: string = x.hospital
                    const productName: string = x.product
                    const oh = hosps.find((y) => y.name === hospName)
                    const op = products.find((y) => y.name === productName)
                    item.hospital = oh
                    item.product = op
                    item.resource = null
                }

                if (item.category === "Resource") {
                    const resName = x.resource
                    const productName: string = x.product
                    const or = resources.find((y) => y.name === resName)
                    const op = products.find((y) => y.name === productName)
                    item.hospital = null
                    item.product = op
                    item.resource = or
                }

                if (item.category === "Product") {
                    const productName: string = x.product
                    const op = products.find((y) => y.name === productName)
                    item.hospital = null
                    item.product = op
                    item.resource = null
                }

                // if (item.category & 8 /*PresetCategory.Protental*/) {
                //     const hospName: string = x.hospital
                //     const productName: string = x.product
                //     const op = products.find((y) => y.name === productName)
                //     const oh = hosps.find((y) => y.name === hospName)
                //     item.hospital = oh
                //     item.product = op
                //     item.resource = null
                // }

                // if (item.category & 16 /*PresetCategory.Share*/) {
                //     const productName: string = x.product
                //     const op = products.find((y) => y.name === productName)
                //     item.hospital = null
                //     item.product = op
                //     item.resource = null
                // }
                // item.proposal = fp
                // @ts-ignore
                item.proposalId = fp._id.toString()
                return th.getModel().create(item)
            }))
        }
    }
}
