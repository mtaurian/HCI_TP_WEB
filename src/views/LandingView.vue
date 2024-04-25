<script setup lang="ts">
import router from '@/router'
import { RouterLink } from 'vue-router'

const data = localStorage.getItem('user_data')
if (data) {
  const user = JSON.parse(data)
  router.push(`/dashboard/${user.last_home}/${user.last_room}`)
}
</script>

<template>
  <main class="text-accent">
    <header>
      <img src="@/assets/logo.png" alt="logo" />
      <h1>Simplificando la casa de tus sueños</h1>
      <RouterLink to="about">
        <v-btn size="x-large" class="bg-surface">EMPEZAR AHORA</v-btn>
      </RouterLink>
    </header>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel
        title="¿Qué servicios ofrecemos?"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      ></v-expansion-panel>
      <v-expansion-panel
        title="¿Qué dispositivos soporta?"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      ></v-expansion-panel>
      <v-expansion-panel
        title="¿En qué plataformas se puede utilizar?"
        text="
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        "
      ></v-expansion-panel>
    </v-expansion-panels>
  </main>
</template>

<style scoped>
main {
  display: grid;
  place-items: center;
  gap: 2rem;

  width: 60%;
  min-height: 100vh;

  margin: 0 auto;
  padding: 3rem;
  padding-top: 0;
}

header {
  display: grid;
  place-items: center;
  gap: 2rem;

  width: 70%;

  margin: 0 auto;
  padding: 1rem;
}

img {
  width: 40%;
  max-width: 300px;
}

h1 {
  text-align: center;
  font-size: 3rem;
  font-weight: 300;
}
</style>
