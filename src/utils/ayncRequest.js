/**
 * Created by Administrator on 2018/1/12 0012.
 */

export function ayncRequest(params) {
  const xhr = new XMLHttpRequest();
        xhr.open(params.method||"GET", params.url||"", false)
        xhr.send(params.data||null);
        if(xhr.status == 200&&xhr.readyState == 4){                  
      	  params.success && params.success(JSON.parse(xhr.response));    
        }
  
}
