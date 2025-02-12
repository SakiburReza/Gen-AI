<script setup lang="ts">
import { computed, ref } from 'vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'


import { useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import DesignEditor from '@/konvaJsDemo/designEditor.vue'

const searchQuery = ref('')
const route = useRoute()
const showBadge = computed(() => route.path !== '/')
const activeTab = ref('for-you')
const authTokenInfo = ref('')
const toastStore = useToastStore()

const checkAuthentication = () => {
  authTokenInfo.value = localStorage.getItem('authToken');
  return !!authTokenInfo.value;
};

const changeTab = (tab: string) => {
  if ((tab === 'favourites' || tab === 'following') && !checkAuthentication()) {
    toastStore.error('Please login to view this page');
    return;
  }
  activeTab.value = tab;
};
</script>

<template>
  <DefaultLayout :showBadge="showBadge">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-10 py-2 sticky top-0 z-10 w-full">
        <div class="flex items-center space-x-10 text-sm sm:text-base md:text-lg">
          <span v-for="tab in ['editor']"
                :key="tab"
                @click="changeTab(tab)"
                class="cursor-pointer font-semibold text-sm sm:text-base md:text-lg pb-2"
                :class="{
                  'text-raisinblack border-b-2 border-raisinblack': activeTab === tab,
                  'text-gray-400 hover:text-raisinblack': activeTab !== tab
                }">
            {{ tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
          </span>
        </div>
      </div>

      <!-- Content Section-->
      <div v-if="activeTab === 'editor'" class="flex-1 p-4">
        <DesignEditor />
      </div>
    </div>
  </DefaultLayout>
</template>
