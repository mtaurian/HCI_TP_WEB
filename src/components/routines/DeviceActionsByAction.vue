
<template>

  <v-dialog persistent v-if="props.device_actionName===ActionsEnum.SETCOLOR" max-width="300">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :color="selectedColor.startsWith('#') ? selectedColor : '#' + selectedColor"
        text="Select Color"
        variant="flat"
        @click="() => oldColor = selectedColor"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-color-picker
          @update:modelValue="onUpdateColor"
          v-model="selectedColor"
          theme="light"
          mode="rgba" class="colorPicker"/>
      <v-card theme="light" class="center">
        <v-card-actions >
          <v-spacer></v-spacer>
          <v-btn
            text="Cancel"
            color="error"
            @click="() => {isActive.value = false; selectedColor = oldColor}"
          ></v-btn>
          <v-btn
            text="Save"
            color="primary"
            @click="() => {onColorPickerSave(); isActive.value = false }"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <div class="slider-Group" v-if="props.device_actionName===ActionsEnum.SETBRIGHTNESS
  || props.device_actionName===ActionsEnum.SETLEVEL">
    <v-slider :min="0" :max="100" :step="1"
              @update:modelValue="emitResponseSlider" thumb-label="always"
              :model-value="slider"
    >
      <template #thumb-label>
        <p class="text">{{ slider }}</p>
      </template>
    </v-slider>
  </div>
  <div class="dispense" v-if="props.device_actionName===ActionsEnum.DISPENSE">
    <div class="slider-Group">
    <v-slider :model-value="slider" :step="1" :min="1" :max="100"
              @update:modelValue="emitResponseSlider"
              thumb-label="always"
    >
      <template #thumb-label>
        <p class="text">{{ slider }}</p>
      </template>
    </v-slider>
    </div>
    <v-select v-if="props.device_actionName===ActionsEnum.DISPENSE"
              :items="['ml', 'cl', 'dl', 'l', 'dal', 'hl', 'kl']"
              label="Select unit"
              @update:modelValue="(val) => {emitResponse2(val) ; updateSelected(val)}"
              :model-value="select"
    />
  </div>
  <div class="slider-Group" v-if="props.device_actionName===ActionsEnum.SETTEMPERATURE">
    <v-slider :min="props.device_type_name === 'ac' ? 18 : ((props.device_type_name === 'oven') ? 90 : 2)" :max="props.device_type_name === 'ac' ? 38 : ((props.device_type_name === 'oven') ? 230 : 8)" :step="1"
              @update:modelValue="emitResponseSlider" thumb-label="always"
              :model-value="slider"
    >
      <template #thumb-label>
        <p class="text">{{ slider }}</p>
      </template>
    </v-slider>
  </div>
  <v-select v-if="device_actionName===ActionsEnum.SETHEAT"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select heat"
            :items="[ 'conventional', 'bottom', 'top']"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETGRILL"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select grill"
            :items="[ 'large', 'eco', 'off']"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETCONVECTION"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select convection"
            :items="[ 'normal', 'eco', 'off']"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETMODE"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select Mode"
            :items="device_type_name==='vacuum' ? ['vacuum', 'mop'] : (device_type_name === 'refrigerator') ? ['default', 'vacation', 'party'] :  [ 'cool', 'heat', 'fan'] "
  />
  <v-select v-if="device_actionName===ActionsEnum.SETVERTICALSWING"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select Vertical Swing"
            :items="[ 'auto', '22', '45', '67', '90']"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETHORIZONTALS"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select Horizontals"
            :items="[ 'auto', '-90', '-45', '0', '45', '90']"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETFANSPEED"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Select Convection"
            :items="[ 'auto', '25', '50', '75', '100']"
  />
  <v-text-field v-if="device_actionName===ActionsEnum.CHANGESECURITYCODE"
            @update:modelValue="emitResponse"
            label="New Code"
  />
  <v-select v-if="device_actionName===ActionsEnum.SETLOCATION"
            @update:modelValue="(val) => {emitResponse(val) ; updateSelected(val)}"
            :model-value="select"
            label="Working Location"
            :items="homeStore.rooms"
            :item-value="item => item.id"
            :item-title="item => item.name"
  />
  <v-number-input v-if="device_actionName===ActionsEnum.SETFREEZERTEMPERATURE"
                  @update:modelValue="emitResponse"
                  :model-value="tempRefriVal"
                  label="Temperature"
  />
</template>


<script setup lang="ts">

import { onMounted, ref, watchEffect } from 'vue'
import { useHomeStore } from '@/stores'

const props = defineProps<{
  device_actionName: string,
  device_type_name : string,
  theParams? :( number | string)[] | null
}>()

const emit = defineEmits(['response', 'response2']);
const homeStore = useHomeStore()

let done = false;
const minSliderMap = {ac : 18, refrigerator : 2, oven : 90, lamp : 0, faucet : 1, blinds : 0}

const defaultSelect = {
  setMode : {vacuum : 'vacuum', ac : 'cool', refrigerator : 'default'},
  dispense : {faucet : 'ml'},
  setHeat : {oven : 'conventional'},
  setVerticalSwing : {ac : 'auto'},
  setHorizontalSwing : {ac : 'auto'},
  setFanSpeed : {ac : 'auto'},
  setLocation : {vacuum : homeStore.rooms[0]},
  setGrill : {oven : 'large'},
  setConvection : {oven : 'normal'}
}

watchEffect(() => {
  console.log("props: ", props.theParams)
  if (!props.theParams && !done) {
    done = true
    const action = props.device_actionName
    if (action === ActionsEnum.SETBRIGHTNESS ||
      action === ActionsEnum.SETLEVEL ||
      action === ActionsEnum.SETTEMPERATURE
    ) {
      emit('response', minSliderMap[props.device_type_name as keyof typeof minSliderMap ])
    } else if (action === ActionsEnum.DISPENSE) {
      emit('response', minSliderMap['faucet'])
      emit('response2', defaultSelect[ActionsEnum.DISPENSE]['faucet'])
    } else if (action === ActionsEnum.SETCOLOR) {
      emit('response', 'FFFFFF')
    } else if (action === ActionsEnum.SETFREEZERTEMPERATURE) {
      emit('response', 0)
    } else if (defaultSelect[props.device_actionName as keyof typeof defaultSelect ]) {
      emit('response', defaultSelect[props.device_actionName as keyof typeof defaultSelect][props.device_type_name as keyof typeof defaultSelect[ keyof typeof defaultSelect]])
    }

  }
}, )


const selectedColor = ref(
  (props.theParams
    && props.theParams.length > 0
  ) ? ((typeof props.theParams[0] == 'string') ? props.theParams[0] : ((props.theParams.length > 1 && typeof props.theParams[1] == 'string') ? props.theParams[1] : 'FFFFFF')) : 'FFFFFF')

const oldColor = ref('')



const select = ref(
  (props.theParams
    && props.theParams.length > 0
  ) ? ((typeof props.theParams[0] == 'string') ? props.theParams[0] : ((props.theParams.length > 1 && typeof props.theParams[1] == 'string') ? props.theParams[1] :
      defaultSelect[props.device_actionName as keyof typeof defaultSelect]?.[props.device_type_name as keyof typeof defaultSelect[keyof typeof defaultSelect]] ?? '' )) :
     defaultSelect[props.device_actionName as keyof typeof defaultSelect]?.[props.device_type_name as keyof typeof defaultSelect[keyof typeof defaultSelect]] ?? '' )

const updateSelected = (val : string) => {
  select.value = val;
}

console.log(props.theParams)
const slider = ref((props.theParams
  ) ? ((typeof props.theParams[0] === 'number') ? props.theParams[0] : ((typeof props.theParams[1] === 'number') ? props.theParams[1] : minSliderMap[props.device_type_name as keyof typeof minSliderMap])) : minSliderMap[props.device_type_name as keyof typeof minSliderMap])

const onColorPickerSave = () => {
  emit("response", selectedColor.value.slice(1))
  console.log(selectedColor.value)
}

const onUpdateColor = (color : string) => {
  selectedColor.value = color;
}

const emitResponse = (rta : string | number |  null)=>{
  if(rta===null) return
  emit("response", rta)
}
const tempRefriVal =  ref((props.theParams
  && props.theParams.length > 0
) ? ((typeof props.theParams[0] == 'number') ? props.theParams[0] : ((props.theParams.length > 1 && typeof props.theParams[1] == 'number') ? props.theParams[1] : 0)) : 0)

const emitResponseSlider = (rta : number )=>{
  slider.value = rta;
  emit("response", rta)
}

const emitResponse2 = (rta : string | number |  null)=>{
  if(rta===null) return
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
