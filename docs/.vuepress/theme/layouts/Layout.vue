<template>
  <Common>
    <HomeBlog v-if="$frontmatter.home"/>
    <Page v-else :sidebar-items="sidebarItems"/>
    <Footer v-if="$frontmatter.home" class="footer" />
  </Common>
</template>

<script>
// import Home from '../components/Home'
import HomeBlog from '../components/HomeBlog'
import Footer from '../components/Footer'
import Common from '../components/Common'
import { resolveSidebarItems } from '../helpers/utils'

export default {
  components: { HomeBlog, 'Page': () => import('../components/Page'), Common, Footer },

  computed: {
    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    }
  }
}
</script>
<style src="prismjs/themes/prism-tomorrow.css"></style>
<!-- scoped,只在当前组件生效,不会影响到子组件 -->