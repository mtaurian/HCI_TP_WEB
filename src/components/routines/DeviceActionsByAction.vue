
<template>

  <v-dialog persistent v-if="props.device_actionName===ActionsEnum.SETCOLOR" max-width="300">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="Select Color"
        variant="flat"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-color-picker
          @update:modelValue="onUpdateColor"
          v-model="selectedColor"
          mode="rgba" class="colorPicker"/>
      <v-card class="center">
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn
            text="Cancel"
            color="error"
            @click="isActive.value = false"
          ></v-btn>
          <v-btn
            text="Save"
            color="primary"
            @click="[onColorPickerSave, isActive.value = false ]"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <div class="slider-Group" v-if="props.device_actionName===ActionsEnum.SETBRIGHTNESS
  || props.device_actionName===ActionsEnum.SETLEVEL">
    <p class="text">{{ slider }}</p>
    <v-slider :min="0" :max="100" :step="1"
              @update:modelValue="emitResponseSlider"/>
  </div>
  <div class="dispense" v-if="props.device_actionName===ActionsEnum.DISPENSE">
    <div class="slider-Group">
    <p class="text">{{ slider }}</p>
    <v-slider :model-value="slider" :step="1" :min="0" :max="100"
              @update:modelValue="emitResponseSlider"
    />
    </div>
    <v-select v-if="props.device_actionName===ActionsEnum.DISPENSE"
              :items="['ml', 'cl', 'dl', 'l', 'dal', 'hl', 'kl']"
              label="Select unit"
              class="dispense-unit"
              @update:modelValue="emitResponse2"/>
  </div>
  <div class="slider-Group" v-if="props.device_actionName===ActionsEnum.SETTEMPERATURE">
    <p class="text">{{ slider }}</p>
    <v-slider :min="props.device_type_name === 'ac' ? 18 : 90" :max="props.device_type_name === 'ac' ? 38 : 230" :step="1"
              @update:modelValue="emitResponseSlider"/>
  </div>
  <v-select v-if="device_actionName===ActionsEnum.SETHEAT"
            @update:modelValue="emitResponse"
            label="Select heat"
            :items="[ 'conventional', 'bottom', 'top']"
            class="select"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETMODE"
            @update:modelValue="emitResponse"
            label="Select Mode"
            :items="device_type_name==='vacuum' ? ['vacuum', 'mop'] : (device_type_name === 'refrigerator') ? [ 'cool', 'heat', 'fan'] : ['default', 'vacation', 'party']"
            class="select"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETVERTICALSWING"
            @update:modelValue="emitResponse"
            label="Select Vertical Swing"
            :items="[ 'auto', '22', '45', '67', '90']"
            class="select"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETHORIZONTALS"
            @update:modelValue="emitResponse"
            label="Select Horizontals"
            :items="[ 'auto', '-90', '-45', '0', '45', '90']"
            class="select"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETFANSPEED"
            @update:modelValue="emitResponse"
            label="Select Convection"
            :items="[ 'auto', '25', '50', '75', '100']"
            class="select"
  />
  <v-text-field v-if="device_actionName===ActionsEnum.CHANGESECURITYCODE"
            @update:modelValue="emitResponse"
            label="New Code"
            class="select"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETLOCATION"
            @update:modelValue="emitResponse"
            label="Working Location"
            :items="homeStore.rooms"
            :item-value="item => item.id"
            :item-title="item => item.name"
            class="select"
  />
  <v-number-input v-if="device_actionName===ActionsEnum.SETFREEZERTEMPERATURE"
                  @update:modelValue="emitResponse"
                  label="Temperature"
                  class="select"
  />
</template>


<script setup lang="ts">

import { ref } from 'vue'
import { useHomeStore } from '@/stores'

const props = defineProps<{
  device_actionName: string,
  device_type_name : string
}>()

const emit = defineEmits(['response', 'response2']);
const homeStore = useHomeStore()
const selectedColor = ref('FFFFFF')
const slider = ref(0)

const onColorPickerSave = () => {
  emit("response", selectedColor.value)
}

const onUpdateColor = (color : string) => {
  selectedColor.value = color;
}

const emitResponse = (rta : string | number |  null)=>{
  console.log(rta)
  if(!rta) return
  emit("response", rta)
}

const emitResponseSlider = (rta : number )=>{
  console.log("tttt" + rta)
  slider.value = rta;
  emit("response", rta)
}

const emitResponse2 = (rta : string | number |  null)=>{
  if(!rta) return
  emit("response2", rta)
}







enum ActionsEnum {
  SETVOLUME = 'setVolume',
  PLAY = 'play',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
  NEXTSONG = 'nextSong',
  PREVIOUSSONG = 'previousSong',
  SETGENRE = 'setGenre',
  GETPLAYLIST = 'getPlaylist',
  OPEN = 'open',
  CLOSE = 'close',
  DISPENSE = 'dispense',
  SETLEVEL = 'setLevel',
  TURNON = 'turnOn',
  TURNOFF = 'turnOff',
  SETCOLOR = 'setColor',
  SETBRIGHTNESS = 'setBrightness',
  SETTEMPERATURE = 'setTemperature',
  SETHEAT = 'setHeat',
  SETGRILL = 'setGrill',
  SETCONVECTION = 'setConvection',
  SETMODE = 'setMode',
  SETVERTICALSWING = 'setVerticalSwing',
  SETHORIZONTALS = 'setHorizontalSwing',
  SETFANSPEED = 'setFanSpeed',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  CHANGESECURITYCODE = 'changeSecurityCode',
  ARMSTAY = 'armStay',
  ARMAWAY = 'armAway',
  DISARM = 'disarm',
  START = 'start',
  DOCK = 'dock',
  SETLOCATION = 'setLocation',
  SETFREEZERTEMPERATURE = 'setFreezerTemperature'
}
</script>

<style>
  .center{
   justify-items: center;
    align-items: center;
  }

  .dispense{
    display: flex;
    flex-direction: column;
    width: 10rem;
  }
  .text{
    color : black;
    font-size: large;
    margin-right: 2rem;
  }
  .slider-Group{
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
  }
  .select{
    align-items: center;
    margin-top: 2rem;
  }
</style>
