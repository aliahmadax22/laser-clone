<template>
  <div class="box" :class="{ small }">
    <div
      v-if="!hideHeader"
      class="box-toolbar"
      :class="{
        'alt-toolbar': altHeader,
        'clean-toolbar': cleanHeader,
        'light-toolbar': lightHeader,
        expandable,
      }"
    >
      <h2 class="box-header m-0" @click="onClickExpandableHeader">
        <SvgIcon
          v-if="expandable"
          class="me-2"
          type="mdi"
          :path="isExpanded ? mdiChevronUp : mdiChevronDown"
          :size="25"
        />
        <span>{{ props.header }}</span>
      </h2>
      <div class="box-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <component
      :is="form ? 'form' : 'div'"
      class="box-content"
      :class="{ expandable, expanded: isExpanded }"
      :style="{ minHeight: props.minHeight }"
      @submit.prevent.stop="$emit('submit')"
    >
      <div>
        <slot />
      </div>
      <div v-if="!hideFooter" class="box-footer text-end mt-4 py-4">
        <slot name="footer" />
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    header?: string;
    form?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    altHeader?: boolean;
    cleanHeader?: boolean;
    lightHeader?: boolean;
    small?: boolean;
    expandable?: boolean;
    minHeight?: string;
  }>(),
  {
    header: "",
    minHeight: "330px",
  }
);

defineEmits(["submit"]);

const isExpanded = ref(false);

const onClickExpandableHeader = () => {
  if (props.expandable) {
    isExpanded.value = !isExpanded.value;
  }
};
</script>
<style lang="scss" scoped>
.box {
  border: 1px dotted var(--bs-gray-500);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  &-toolbar {
    background-color: var(--bs-info);
    padding: 20px 15px;
    display: flex;
    justify-content: space-between;
    color: var(--bs-primary);
    column-span: all;
    &.alt-toolbar {
      background-color: var(--bs-gray-900);
      text-align: center;
      .box-header {
        color: white;
      }
    }
    &.light-toolbar {
      background-color: var(--bs-light);
      text-align: center;
      .box-header {
        color: var(--bs-gray-900);
      }
    }
    &.clean-toolbar {
      background-color: initial;
      color: var(--bs-primary);
    }
    &.expandable {
      cursor: pointer;
    }
  }
  &-actions {
    color: var(--bs-gray-900);
  }
  &-header {
    text-transform: uppercase;
    font-size: 20px;
    font-family: "Exo 2", sans-serif;
  }
  &-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    padding: 10px 20px;

    &.expandable {
      overflow: hidden;
      display: none;
      transition: height 0.3s ease;
      user-select: none;
    }

    &.expanded {
      display: flex;
    }
  }
  &-footer {
    border-top: 1px solid #e8e8e8;
  }

  &.small {
    .box-toolbar {
      padding: 10px 10px;
    }
    .box-header {
      font-size: 14px;
    }
    .box-content {
      padding: 5px 10px;
    }
  }
}
</style>
