import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const vedioSchema=new Schema(
{
    vedioFile:{
        type:String,
        required:true,
    },
    thumbnali:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    veiws:{
        type:Number,
        default:0,
    },
    published:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'Vedio'
    }

},{timestamps:true}
)

vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio=mongoose.model("Vedio",vedioSchema)