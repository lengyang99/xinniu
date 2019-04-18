/**
 * Created by Administrator on 2018/1/12 0012.
 */

import reqwest from 'reqwest'

const AjaxUtil = (objdata) =>{
     reqwest({
        url: objdata.url
        , method: objdata.method ||'get'
        , data: objdata.data || ''
        , contentType: objdata.contentType || 'application/json'
        , error: function (err) { if(objdata.error) objdata.error() }
        , success: function (result) {
            if(objdata.callback){
                objdata.callback(result)
            }
        }
    })
}

export default  AjaxUtil
