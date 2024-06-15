class apiError  extends Error {
    constructor (
        statuscode,
        message="somehting went wrong",
        Error=[],
        stack=""
    ){
        super(message)
        this.statuscode=statuscode
        this.data=null
        this.message=message
        this.succes=false
        this.errors=errors

        if(stack){his.
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }


}


export {apiError}