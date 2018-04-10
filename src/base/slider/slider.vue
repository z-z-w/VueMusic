<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item,index) in dots"></span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from "../../common/js/dom";

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if(this.autoPlay) {
          this._play();
        }
      }, 20);

      //监听窗口大小改变的时候，重新设置slider的宽度
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        //此处貌似为BScroll要实现无缝轮播循环功能，需要父宽度比子总宽度大2个子宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }

        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initDots(){
        this.dots = new Array(this.children.length);
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          //这个配置是为了做 Slide 组件用的，默认为 false，如果开启则需要配置一个 Object
          snap: {
            // 以下为新版写法
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
        });

        //监听滚动结束，用于改变dots的状态
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          // 这是旧版写法 新版不用
          // if (this.loop) {
          //   pageIndex -= 1
          // }
          this.currentPageIndex = pageIndex
          if(this.autoPlay) {
            //先清除定时器再重新开启
            clearTimeout(this.timer);
            this._play();
          }
        })
      },
      _play() {
        // 旧版写法
        // let pageIndex = this.currentPageIndex + 1;
        // if (this.loop) {
        //   pageIndex += 1
        // }

        //设置定时滚动
        this.timer = setTimeout(() => {
          // 以下为新版写法
          this.slider.next();
        }, this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" type="text/stylus">
    @import "~common/stylus/variable"

    .slider
        min-height: 1px
        .slider-group
            position: relative
            overflow: hidden
            white-space: nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                img
                    display: block
                    width: 100%
        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            text-align: center
            font-size: 0
            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l
                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>