"use strict"
import { JsonObject, JsonProperty } from "json2typescript"
import { prop, Ref, Typegoose } from "typegoose"
import Hospital from "./Hospital"
import IModelBase from "./modelBase"
import Product from "./Product"
import Proposal from "./Proposal"
import Resource from "./Resource"

@JsonObject("Preset")
class Preset extends Typegoose implements IModelBase<Preset> {

    @prop({ref: Proposal, required: true, default: null})
    public proposal?: Ref<Proposal>

    @prop({ required: false, default: "" })
    public proposalId?: string

    @prop({ref: Product, required: true, default: null })
    public product?: Ref<Product>

    @prop({ref: Hospital, required: true, default: null })
    public hospital?: Ref<Hospital>

    @prop({ref: Resource, required: false, default: null })
    public resource?: Ref<Resource>

    @JsonProperty("phase", Number)
    @prop({ required: true, default: 0 })
    public phase: number = 0  //

    @JsonProperty("category", Number)
    @prop({ default: 0 })
    public category?: number = 0  //

    @JsonProperty("salesQuota", Number)
    @prop({ default: 0 })
    public salesQuota?: number = 0  // p_quota

    @JsonProperty("sales", Number)
    @prop({ default: 0 })
    public sales?: number = 0    // p_sales

    @JsonProperty("achievements", Number)
    @prop({ default: 0.0 })
    public achievements?: number = 0     // p_sales

    @JsonProperty("potential", Number)
    @prop({ default: 0 })
    public potential?: number = 0   // 铁马不变

    @JsonProperty("share", Number)
    @prop({ default: 0 })
    public share?: number = 0   // p_share

    @JsonProperty("territoryManagementAbility", Number)
    @prop({ required: false, default: 0 })
    public territoryManagementAbility?: number = 0 // p_territory_management_ability

    @JsonProperty("salesSkills", Number)
    @prop({ default: 0 })
    public salesSkills?: number = 0 // p_sales_skills

    @JsonProperty("productKnowledge", Number)
    @prop({ default: 0 })
    public productKnowledge?: number = 0 // p_product_knowledge

    @JsonProperty("behaviorEfficiency", Number)
    @prop({ default: 0 })
    public behaviorEfficiency?: number = 0// p_behavior_efficiency

    @JsonProperty("workMotivation", Number)
    @prop({ default: 0 })
    public workMotivation?: number = 0 // p_work_motivation

    @JsonProperty("targetDoctorNum", Number)
    @prop({ default: 0 })
    public targetDoctorNum?: number = 0 // p_target

    @JsonProperty("targetDoctorCoverage", Number)
    @prop({ default: 0.0 })
    public targetDoctorCoverage?: number = 0.0 // p_target_coverage

    @JsonProperty("highTarget", Number)
    @prop({ required: true, default: 0 })
    public highTarget?: number = 0 // p_high_target

    @JsonProperty("middleTarget", Number)
    @prop({ default: 0 })
    public middleTarget?: number = 0 // p_middle_target

    @JsonProperty("lowTarget", Number)
    @prop({ default: 0 })
    public lowTarget?: number = 0 // p_low_target

    @JsonProperty("patientNum", Number)
    @prop({ required: false, default: 0 })
    public patientNum?: number = 0

    @JsonProperty("ytd", Number)
    @prop({ required: false, default: 0 })
    public ytd?: number = 0

    @JsonProperty("lySales", Number)
    @prop({ required: false, default: 0 })
    public lySales?: number = 0

    public getModel() {
        return this.getModelForClass(Preset)
    }
}

export default Preset
