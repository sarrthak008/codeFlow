 
  const responder = (res = null, status = 200 , data = {} , success = true, message = 'codeFlow is here')=>{
    if(!res) return `responce object missing` ;

     return res.status(status).json({
         data , success , message
     })
  }

  export default responder; 