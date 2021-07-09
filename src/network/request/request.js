import axios from 'axios'
export function request(config){

  return new Promise((resolve,reject)=>{
    let newVar=axios.create({
      baseURL:'http://192.168.2.146:8080/staff/',
      timeout:5000
    });
    newVar(config).then(res=>{
      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}
