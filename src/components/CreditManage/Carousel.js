import React, {PureComponent} from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/dist/css/swiper.min.css';

export default class Carousel extends PureComponent {
  componentDidMount () {
    // if(!this.swiper){
    //   this.swiper = new Swiper('.swiper-container', {
    //     navigation: {
    //       nextEl: '.swiper-button-next',
    //       prevEl: '.swiper-button-prev',
    //     },
    //     loop: true,
    //     pagination: {
    //       el: '.swiper-pagination',
    //     },
    //   });
    // }
  }

  componentWillUnmount() {
    // if(this.swiper){
    //   this.swiper.destroy()
    // }
  }

  render () {
    const params = {
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    };

    return (
      <div  style={{width: 412}}>
        <h2>
        {this.props.authType === 10 ? '房产审核' : this.props.authType === 20 ? '社保审核' : this.props.authType === 30 ? '公积金审核' : this.props.authType === 40 ? '网银审核' : '--'}
        </h2>
      {/*<div className="swiper-container" style={{width: 412, height: 210}}>*/}
        {/*<div className="swiper-wrapper" style={{width: '100%', height: '100%'}}>*/}
            {/*{*/}
              {/*this.props.imgList.map((img, index) =>*/}
                {/*<div className="swiper-slide" key={index}>*/}
                  {/*<img src={img.imageUrl} alt="" style={{width: '100%', height: '100%'}}/>*/}
                {/*</div>*/}
              {/*)*/}
            {/*}*/}
        {/*</div>*/}
        {/*<div className="swiper-pagination"></div>*/}
        {/*<div className="swiper-button-prev"></div>*/}
        {/*<div className="swiper-button-next"></div>*/}
      {/*</div>*/}
        <Swiper {...params}>
          {
            this.props.imgList.map((img, index) =>
              <div className="swiper-slide" key={index}>
                <img src={img.imageUrl} alt="" style={{width: 412, height: 210}}/>
              </div>
            )
          }
        </Swiper>
      </div>
    )
  }
}
