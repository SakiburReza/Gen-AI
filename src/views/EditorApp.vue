<template>
  <DefaultLayout>
  <div class="h-screen flex flex-col">

    <header class="h-16 flex items-center justify-center bg-black-2 text-white">
      <button
        @click="store.addPage"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow">
        Add Page
      </button>
    </header>
    <main class="flex-1" ref="editorRef"></main>
  </div>
  </DefaultLayout>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import createStore from "polotno/model/store";
import "@blueprintjs/core/lib/css/blueprint.css";
import DefaultLayout from '@/layout/DefaultLayout.vue'

const store = createStore({ key: "your-api-key", showCredit: true });
store.addPage();

const App = () => (
  React.createElement(PolotnoContainer, { style: { height: "100vh" } },
    React.createElement(SidePanelWrap, {}, React.createElement(SidePanel, { store })),
    React.createElement(WorkspaceWrap, {},
      React.createElement(Toolbar, { store }),
      React.createElement(Workspace, { store }),
      React.createElement(ZoomButtons, { store })
    )
  )
);

const editorRef = ref(null);
let root;

onMounted(() => {
  if (editorRef.value) {
    root = ReactDOM.createRoot(editorRef.value);
    root.render(React.createElement(App));
  }
});

onUnmounted(() => {
  root?.unmount();
});
</script>
