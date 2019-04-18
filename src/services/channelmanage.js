import request from '../utils/request';

// 获取所有渠道列表
export async function queryChannelList(){
	  return request('/modules/manage/common/channelList.htm')
}


// 添加渠道
export async function querySaveChannel(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/userChannel/saveChannel.htm',
			  {method:'POST',
		  body:paramsStr.join("&")
	  });
}

export async function channelStatisticExport(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
  }
  window.location.href = '/modules/manage/channelStatistic/export.htm?'+paramsStr.join("&");
}


//修改渠道
export async function queryUpdateChannel(params){
	  let paramsStr = [];
	  for(let p in params){
		  paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/userChannel/updateChannel.htm',
			  {method:'POST',
		  body:paramsStr.join("&")
	  });
}

//通过id获取渠道
export async function queryGetChannelById(params){

	  return request(`/modules/manage/userChannel/findChannel.htm?id=#{params}`)


}


export async function channelFyList(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/channelCharge/list.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
}

export async function addChannelFy(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/channelCharge/add.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
}

export async function updateChannelFy(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/channelCharge/update.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
}

export async function channelStatisticList(params){
  let paramsStr = [];
  for(let p in params){
    paramsStr.push(p+`=`+params[p]);
  }
  return request('/modules/manage/channelStatistic/list.htm',
    {method:'POST',
      body:paramsStr.join("&")
    });
}

//获取折扣列表
export async function channelDiscountList(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/channelDiscount/list.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
	}

//更新明天渠道折扣
export async function updaterChannelDiscount(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/channelDiscount/updateChannelDiacount.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
	}

//获取第三方渠道信息
export async function getChannelDateList(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+params[p]);
	  }
	  return request('/modules/manage/thirdpartyChannel/cahnenlDataList.htm',
	    {method:'POST',
	      body:paramsStr.join("&")
	    });
	}

export async function channelListDateExport(params){
	  let paramsStr = [];
	  for(let p in params){
	    paramsStr.push(p+`=`+encodeURIComponent(params[p]));
	  }
	  window.location.href = '/modules/manage/thirdpartyChannel/exportChannelListData.htm?'+paramsStr.join("&");
	}
