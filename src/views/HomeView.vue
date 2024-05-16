<script setup lang="ts">
import ControllerPlaceholder from '@/components/ControllerPlaceholder.vue'
import DevicesList from '@/components/DevicesList.vue'

function changeRoom(room: string) {
  alert(`Room changed to ${room}`)
}

function deleteDevice() {
  alert('Device deleted')
}
</script>

<template>
  <main>
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <DevicesList />
    </div>
    <div class="separator"></div>
    <div class="controller">
      <div>
        <ControllerPlaceholder @change_room="changeRoom" @delete="deleteDevice" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: calc(100vh - 64px); /* full screen - NavBar */

  display: grid;
  grid-template-columns: 30% 2px 1fr;
}

.separator {
  background-color: #4a4458;
  margin: 1rem 0;
  opacity: 0.5;
}

.controller {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.controller > div {
  width: 80%;
  height: 80%;
}

.list {
  display: flex;
  margin-top: 1%;
  justify-content: center;
  align-items: center;
}
</style>
