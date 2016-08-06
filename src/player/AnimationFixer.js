export default class AnimationFixer {
}
// directions
AnimationFixer.currentDirectionIndex = 0
// actions
AnimationFixer.currentActionIndex = 0

const pad5 = [
  {index: 0, flipped: false},
  {index: 1, flipped: false},
  {index: 2, flipped: false},
  {index: 3, flipped: false},
  {index: 4, flipped: false},
  {index: 3, flipped: true},
  {index: 2, flipped: true},
  {index: 1, flipped: true}
]

const pad2 = [
  {index: -1, flipped: false},
  {index: 0, flipped: false},
  {index: -1, flipped: false},
  {index: 1, flipped: false},
  {index: -1, flipped: false},
  {index: 1, flipped: true},
  {index: -1, flipped: true},
  {index: 0, flipped: true}
]

const actions = [
  {name: 'idle', dirs: [0, 1, 2, 3, 4], loop: true, pad: pad5},
  {name: 'run', dirs: [0, 1, 2, 3, 4], loop: true, pad: pad5},
  {name: 'attack', dirs: [1, 3], loop: false, pad: pad2},
  {name: 'skill_magic', dirs: [1, 3], loop: false, pad: pad2},
  {name: 'damage', dirs: [1, 3], loop: false, pad: pad2},
  {name: 'defence', dirs: [1, 3], loop: false, pad: pad2},
  {name: 'death', dirs: [1, 3], loop: false, pad: pad2}
]

AnimationFixer.getAction = () => {
  return actions[AnimationFixer.currentActionIndex]
}

AnimationFixer.nextDir = () => {
  if(AnimationFixer.currentDirectionIndex > 0) {
    AnimationFixer.currentDirectionIndex -= 1
  }else{
    AnimationFixer.currentDirectionIndex = 7
  }

  const pad = actions[AnimationFixer.currentActionIndex].pad[AnimationFixer.currentDirectionIndex]

  if(pad.index < 0) {
    return AnimationFixer.nextDir()
  }

  return pad
}

AnimationFixer.prevDir = () => {
  if(AnimationFixer.currentDirectionIndex < 7) {
    AnimationFixer.currentDirectionIndex += 1
  }else{
    AnimationFixer.currentDirectionIndex = 0
  }

  const pad = actions[AnimationFixer.currentActionIndex].pad[AnimationFixer.currentDirectionIndex]

  if(pad.index < 0) {
    return AnimationFixer.prevDir()
  }

  return pad
}

AnimationFixer.nextAction = () => {
  if(AnimationFixer.currentActionIndex < actions.length - 1) {
    AnimationFixer.currentActionIndex += 1
  }else{
    AnimationFixer.currentActionIndex = 0
  }
  let pad = actions[AnimationFixer.currentActionIndex].pad[AnimationFixer.currentDirectionIndex]
  if(pad.index < 0) {
    pad = AnimationFixer.nextDir()
  }
  return pad
}

AnimationFixer.prevAction = () => {
  if(AnimationFixer.currentActionIndex > 0) {
    AnimationFixer.currentActionIndex -= 1
  }else{
    AnimationFixer.currentActionIndex = actions.length - 1
  }
  let pad = actions[AnimationFixer.currentActionIndex].pad[AnimationFixer.currentDirectionIndex]
  if(pad.index < 0) {
    pad = AnimationFixer.nextDir()
  }
  return pad
}
