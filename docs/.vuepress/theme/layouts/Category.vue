<template>
  <Common class="categories-wrapper">
    <!-- 分类集合 -->
    <ModuleTransition>
      <ul v-show="showModule" class="category-wrapper">
        <li
          class="category-item"
          :class="title == item.name ? 'active': ''"
          v-for="(item, index) in myCategories"
          :key="index">
          <router-link :to="item.path">
            <span class="category-name">{{ item.name }}</span>
            <span class="post-num" :style="{ 'backgroundColor': getOneColor() }">{{ item.pages.length }}</span>
          </router-link>
        </li>
      </ul>
    </ModuleTransition>

    <!-- 博客列表 -->
    <ModuleTransition delay="0.08" v-if="title !== 'all'">
      <note-abstract
        v-show="showModule"
        class="list"
        :data="posts"
        :currentPage="currentPage"
        @currentTag="getCurrentTag"></note-abstract>
    </ModuleTransition>

    <!-- 分页 -->
    <ModuleTransition delay="0.16">
      <Pagination
        class="pagation"
        :total="posts.length"
        :currentPage="currentPage"
        @getCurrentPage="getCurrentPage"></Pagination>
    </ModuleTransition>
  </Common>
</template>

<script>
import Common from '../components/Common'
import NoteAbstract from '../components/NoteAbstract'
import ModuleTransition from '../components/ModuleTransition'
import Pagination from '../components/Pagetion'
import pagination from '../mixins/pagination'
import { sortPostsByStickyAndDate, filterPosts } from '../helpers/postData'
import { getOneColor } from '../helpers/other'
import moduleTransitonMixin from '../mixins/moduleTransiton'

export default {
  mixins: [moduleTransitonMixin, pagination],
  components: { Common, NoteAbstract, ModuleTransition, Pagination },

  data () {
    return {
      currentPage: 1,
      myCategories: []
    }
  },

  computed: {
    // 时间降序后的博客列表
    posts () {
      if (this.$currentCategories) {
        let posts = this.$currentCategories.pages
        posts = filterPosts(posts)
        sortPostsByStickyAndDate(posts)
        return posts
      }
      return this.myCategories
    },
    // 标题只显示分类名称
    title () {
      if (this.$currentCategories) {
        return this.$currentCategories.key
      }
      return 'all'
    }
  },

  mounted () {
    this._setPage(this._getStoragePage())
    this.myCategories = Array.from(this.$categories.list)
    this.myCategories.sort((before, after) => {
      if (before.pages.length - after.pages.length > 0) {
        return -1
      }
      return 1
    })
  },

  methods: {
    // 获取当前tag
    getCurrentTag (tag) {
      this.$emit('currentTag', tag)
    },
    // 获取当前页码
    getCurrentPage (page) {
      this._setPage(page)
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 100)
    },
    _setPage (page) {
      this.currentPage = page
      this.$page.currentPage = page
      this._setStoragePage(page)
    },
    getOneColor
  },

  watch: {
    $route () {
      this._setPage(this._getStoragePage())
    }
  }
}
</script>

<style lang="stylus">
@require '../styles/mode.styl'
.categories-wrapper
  max-width: $contentWidth;
  margin: 0 auto;
  padding: 4.6rem 2.5rem 0;
  .category-wrapper {
    list-style none
    padding-left 0
    .category-item {
      vertical-align: middle;
      margin: 4px 8px 10px;
      display: inline-block;
      cursor: pointer;
      border-radius: $borderRadius
      font-size: 13px;
      box-shadow var(--box-shadow)
      transition: all .5s
      background-color var(--background-color)
      &:hover, &.active {
        background $accentColor
        a span.category-name {
          color #fff
          .post-num {
            color $accentColor
          }
        }
      }
      a {
        display flex
        box-sizing border-box
        width 100%
        height 100%
        padding: 8px 14px;
        justify-content: space-between
        align-items center
        color: #666
        .post-num {
          margin-left 4px
          width 1.2rem;
          height 1.2rem
          text-align center
          line-height 1.2rem
          border-radius $borderRadius
          font-size .7rem
          color #fff
        }
      }
    }
  }

@media (max-width: $MQMobile)
  .categories-wrapper
    padding: 4.6rem 1rem 0;
  .page-edit
    .edit-link
      margin-bottom .5rem
    .last-updated
      font-size .8em
      float none
      text-align left
</style>
<style src="prismjs/themes/prism-tomorrow.css"></style>