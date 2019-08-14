"use strict"
import { prop, Ref, Typegoose } from "typegoose"
import Hospital from "./Hospital"
import IModelBase from "./modelBase"
import Product from "./Product"
import Resource from "./Resource"

class Preset extends Typegoose implements IModelBase<Preset> {

    @prop({ref: Product, required: true})
    public product?: Ref<Product>

    @prop({ref: Hospital, required: true})
    public hospital?: Ref<Hospital>

    @prop({ref: Resource, required: false})
    public resource?: Ref<Resource>

    @prop({ default: 0})
    public salesQuota?: number   // p_quota

    @prop({ default: 0})
    public achievements?: number     // p_sales

    @prop({ default: 0})
    public potential?: number    // 铁马不变

    @prop({ default: 0})
    public share?: number    // p_share

    @prop({ default: ""})
    public territoryManagementAbility?: string // p_territory_management_ability

    @prop({ default: ""})
    public salesSkills?: string // p_sales_skills

    @prop({ default: ""})
    public productKnowledge?: string // p_product_knowledge

    @prop({ default: ""})
    public behaviorEfficiency?: string // p_behavior_efficiency

    @prop({ default: ""})
    public workMotivation?: string // p_work_motivation

    @prop({ default: "" })
    public target?: string // p_target

    @prop({ default: "" })
    public targetCoverage?: string // p_target_coverage

    @prop({ default: "" })
    public highTarget?: string // p_high_target

    @prop({ default: "" })
    public middleTarget?: string // p_middle_target

    @prop({ default: "" })
    public lowTarget?: string // p_low_target

    @prop({ default: 0})
    public targetDoctorNum?: number

    @prop({ default: 0})
    public targetDoctorCoverage?: number

    @prop({ default: 0})
    public visitDoctorA?: number

    @prop({ default: 0})
    public visitDoctorB?: number

    @prop({ default: 0})
    public visitDoctorC?: number

    public getModel() {
        return this.getModelForClass(Preset)
    }
}

export default Preset
