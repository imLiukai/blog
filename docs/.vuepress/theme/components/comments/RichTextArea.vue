<template>
  <ModuleTransition>
    <div class="text-area">
      <div></div>
      <textarea
        v-model="form.comment"
        :placeholder="placeholderText"
        spellcheck
        autocomplete="on"
        maxlength="2048"
        rows="10"
        class="rich-text"
      ></textarea>
      <div @click="selectEmoji($event)">
        <span
          v-for="(item, index) in emojiList"
          :key="index"
          :data-index="index"
          class="emoji"
          >{{ item }}</span
        >
      </div>
      <div class="input-wrapper">
        <input v-model="form.nickname" placeholder="昵称" maxlength="16" class="primary-input" />
        <input v-model="form.email" placeholder="邮箱" maxlength="64" class="primary-input" />
        <input v-model="form.website" placeholder="你的网址" maxlength="64" class="primary-input" />
      </div>
      <div class="align-right btn-wrapper">
        <button class="primary-btn preview" @click="parsePlain()">预览</button>
        <!-- 节流 -->
        <button class="primary-btn submit" :loading="loading" @click="submit()">{{ submitText }}</button>
      </div>
      <ModuleTransition>
        <div class="preview-container" v-show="showPreview" v-html="parseResult"></div>
      </ModuleTransition>
    </div>
  </ModuleTransition>
</template>

<script>
import ModuleTransition from '../ModuleTransition'
import Marked from 'marked'
import http from '../../util/api'
import GlobalBus from '../store'
export default {
  components: {ModuleTransition},
  props: {
    submitText: {
      type: String,
      default: () => '提交'
    },
    placeholderText: {
      type: String,
      default: () => '支持markdown'
    },
    replyId: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      parseResult: '',
      form: {
        nickname: '',
        email: '',
        website: '',
        comment: ''
      },
      showPreview: false,
      loading: false,
      emojiList: [
        '😀',
        '😁',
        '😂',
        '😃',
        '😄',
        '😅',
        '😆',
        '😉',
        '😊',
        '😋',
        '😎',
        '😍',
        '😘',
        '😗',
        '😚',
        '😙',
        '😇',
        '😐',
        '😑',
        '😶',
        '😏',
        '😣',
        '😥',
        '😮',
        '😯',
        '😪',
        '😫',
        '😴',
        '😌',
        '😛',
        '😜',
        '😝',
        '😒',
        '😓',
        '😔',
        '😕',
        '😲',
        '😷',
        '😖',
        '😞',
        '😟',
        '😤',
        '😢',
        '😭',
        '😦',
        '😧',
        '😨',
        '😬',
        '😰',
        '😱',
        '😳',
        '😵',
        '😡',
        '😠',
        '😭',
        '😢',
        '😔',
        '😱',
        '😌',
        '💛',
        '🙂',
        '😒',
        '😜',
        '👍︎',
        '👏',
        '💪',
        '👌',
        '❤️',
        '💕'
      ]
    }
  },
  watch: {
    'form.comment': function(latest, old) {
      if (this.showPreview) this.parseResult = Marked(this.form.comment)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (localStorage.getItem('website')) {
        this.form.website = localStorage.getItem('website')
      }
      if (localStorage.getItem('email')) {
        this.form.email = localStorage.getItem('email')
      }
      if (localStorage.getItem('nickname')) {
        this.form.nickname = localStorage.getItem('nickname')
      }
    },
    selectEmoji(e) {
      const index = e.srcElement.dataset['index']
      if (index) {
        this.form.comment += this.emojiList[index]
      }
    },
    parsePlain() {
      if (this.form.comment === '') return
      this.parseResult = Marked(this.form.comment)
      this.showPreview = !this.showPreview
    },
    submit() {
      if (!this.form.comment) return
      const form = Object.assign({}, this.form)
      form.path = location.pathname
      form.nickname = this.form.nickname || 'Anonymous'
      form.parentId = this.replyId
      this.loading = true
      http({
        url: 'comment',
        method: 'post',
        data: JSON.stringify(form)
      }).then(res => {
        if (res.code === 0) {
          GlobalBus.publish('reFetchComment')
          GlobalBus.publish('msg', '评论发布成功.')
        } else {
          GlobalBus.publish('msg', `评论发布失败: ${res.msg}.`)
        }
        this.clearContent()
      }).catch(error => {console.log(error)}).finally(() => this.loading = false)
    },
    clearContent() {
      this.form.comment = ''
      this.$emit('resetReplyId')
      if (this.form.nickname) localStorage.setItem('nickname', this.form.nickname)
      if (this.form.website) localStorage.setItem('website', this.form.website)
      if (this.form.email) localStorage.setItem('email', this.form.email)
    }
  }
}
</script>

<style scoped lang="stylus">
.text-area
  position relative
  // border 1px solid #eee
  border-radius 4px
  padding 0.15rem
  box-shadow 0 1px 3px rgb(18 18 18 / 10%)
.rich-text
  width 100%
  box-sizing border-box
  padding .5rem
  resize none
  border none
  outline none

.emoji
  padding 0 0.2rem
  font-size 1.3rem
  cursor pointer
  user-select none
  &:hover
    outline 1px solid #409eff

.input-wrapper
  padding 1rem
  input 
    border-bottom 1px solid #eee
    width 30%

.primary-input
  border none
  outline none
  height 2rem
button.preview
  margin-right 1.5rem
@media screen and (max-width: 540px){
  .input-wrapper>input{
    width: 100%
  }
  button.preview {
    margin-left 0
  }
}
.align-right
  text-align right

.primary-btn
  cursor pointer
  display: inline-block
  line-height 1
  white-space nowrap
  background #fff
  border 1px solid #dcdfe6
  color #606266
  text-align center
  box-sizing border-box
  outline none
  margin 0
  transition .1s
  font-weight 500
  user-select none
  padding 12px 20px
  border-radius 4px
  &:hover
    color #409eff
    border-color #c6e2ff
    background-color #ecf5ff
  &:active
    color #3a8ee6
    border-color #3a8ee6
    outline none

.btn-wrapper
  padding: 0.5rem 1rem 0.5rem 1rem;

.submit, .preview
  margin-left: 1.5rem
.preview-container
  padding 0.5rem
  overflow hidden
  word-break break-all

.reply-tags
  background-color: #ecf5ff;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  cursor pointer
</style>
