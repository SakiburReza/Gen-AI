<script setup lang="ts">
import TurnIntoVideoModal from '@/components/FaceSwapToVideoModal.vue'
import PreviewImageModal from '@/components/PreviewImageModal.vue'
import genAiService from '@/services/gen-ai'
import SaveBoardComponent from '@/components/SavedBoardComponent.vue'
import { imageUrl, videoUrl } from '@/utils/utils'
import { computed, onMounted, ref } from 'vue'
import { useToastStore } from '@/stores/toast'

onMounted(() => {
    fetchMedia()
})

const authTokenInfo = ref('')
const searchQuery = ref('')
const isSaveBoardOpen = ref(false)
const selectedImage = ref(null)
const showPreviewModal = ref(false)
const loading = ref(false)
const imageUrlData = ref(null)
const toastStore = useToastStore()


const media = ref<
    {
        url: string
        type: 'image' | 'video'
        orientation: 'P' | 'L'
        isLiked: 'Y' | 'N'
        isShared: 'Y' | 'N'
        prompt: string
        boardName: string
        owner: string
    }[]
>([])
const updateBoardName = ({ imageKey, boardName }) => {
  console.log('updateBoardName', imageKey, boardName);
  
  media.value = media.value.map(item =>
    item.url === imageKey ? { ...item, board: boardName } : item
  );
};

const closePreviewModal = () => {
    showPreviewModal.value = false
    selectedImage.value = null
}
const openPreviewModal = (mediaItem) => {
    if (!checkAuthentication()) return;
    selectedImage.value = mediaItem
    showPreviewModal.value = true
}

const showTurnIntoVideoModal = ref(false)
const closeTurnIntoVideoModal = () => {
    showTurnIntoVideoModal.value = false
    selectedImage.value = null
}
const openTurnIntoVideoModal = (mediaItem) => {
    if (!checkAuthentication()) return;
    selectedImage.value = mediaItem
    showTurnIntoVideoModal.value = true

}
const openSaveBoard = (mediaUrl) => {
    if (!checkAuthentication()) return;
    imageUrlData.value = mediaUrl;
    isSaveBoardOpen.value = true;
};

const openAddFriendModal = () => {
    if (!checkAuthentication()) return;
}

const closeSaveBoard = () => {
    isSaveBoardOpen.value = false
}



// Fetch Images / Videos from API
const fetchMedia = async () => {

    try {
        const { data: response } = await genAiService.getCommunityMedia()

        if (response.status && Array.isArray(response.data)) {
            // Map data with type detection (image/video) for initial load
            media.value = response.data.map((item) => ({
                url: item.content,
                type: item.type,
                orientation: item.orientation,
                prompt: item.prompt,
                isLiked: item.like,
                isShared: item.share,
                owner: item.shareOwner,
                board: item.boardName
            }))
        } else {
            console.error('Failed to fetch images: Invalid response format')
        }
    } catch (error) {
        console.error('Error fetching images:', error)
    } finally {
        loading.value = false
    }
}

const checkAuthentication = () => {
    authTokenInfo.value = localStorage.getItem('authToken')
    if (authTokenInfo.value) {
        return true
    }
    else {
        toastStore.error('Please login to continue')
        return false
    }
}

const filteredMedia = computed(() => {
    if (!searchQuery.value || searchQuery.value.trim() === '') {
        return media.value
    }
    return media.value.filter((item) => {
        const prompt = item.prompt ? item.prompt.toLowerCase() : ''
        return prompt.includes(searchQuery.value.toLowerCase())
    })
})
const copyAction = async (prompt: string) => {
    if (!checkAuthentication()) return;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(prompt)
            toastStore.success('Prompt copied to clipboard')
            console.log('Prompt copied to clipboard:', prompt)
        } catch (error) {
            console.error('Failed to copy prompt using Clipboard API:', error)
        }
    } else {
        console.warn('Clipboard API not supported, using fallback method')
        // Fallback method for unsupported environments
        const textArea = document.createElement('textarea')
        textArea.value = prompt
        textArea.style.position = 'fixed' // Avoid scrolling to the bottom
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        toastStore.success('Prompt copied to clipboard')
        try {
            document.execCommand('copy')
            console.log('Prompt copied to clipboard using fallback')
        } catch (err) {
            console.error('Fallback: Unable to copy prompt:', err)
        }
        document.body.removeChild(textArea)
    }
}

</script>

<template>
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 rounded-t-2xl overflow-y-auto">
        <div v-for="(item, index) in filteredMedia" :key="index" class="relative overflow-hidden group"
            :class="[item.orientation === 'P' ? 'row-span-2' : 'row-span-1']">
            <!-- Render Image -->
            <img v-if="item.type === 'image'" v-lazy="imageUrl() + item.url" :alt="'Media ' + index"
                class="h-full max-w-full w-full object-cover"
                :class="[item.orientation === 'P' ? 'aspect-[3/4]' : 'aspect-[16/9]']"
                @click="openPreviewModal(item)" />

            <!-- Render Video -->
            <img v-else-if="item.type === 'video'" v-lazy="videoUrl() + item.url"
                class="w-full h-full object-cover max-w-full aspect-[16/9]" @click="openPreviewModal(item)"></img>
            <div v-if="item.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/40"
                @click="openPreviewModal(item)">
                <img src="/images/icon/videoPlayButton.svg" alt="">
            </div>

            <!-- Floating Buttons (Visible on Hover) -->
            <!-- Black Gradient Overlay -->
            <div v-if="media[index].owner !== null"
                class="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>

            <div
                class="absolute bottom-1.5 left-1 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                <span class="text-[12px] font-semibold text-white px-1 rounded">
                    {{ media[index].boardName }}
                </span>
                <!-- 
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.42828 6.81419L11.8229 1.09697C12.059 0.846099 12.059 0.439652 11.8229 0.188151C11.5867 -0.0627165 11.203 -0.0627165 10.9668 0.188151L6.0003 5.45189L1.03376 0.188785C0.797568 -0.0620828 0.413932 -0.0620828 0.177143 0.188785C-0.0590478 0.439653 -0.0590478 0.846732 0.177143 1.0976L5.57167 6.81482C5.80542 7.06183 6.19508 7.06183 6.42828 6.81419Z"
                  fill="white" />
              </svg> -->
            </div>


            <div
                class="absolute top-0 w-full h-10 bg-gradient-to-b from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            </div>

            <div
                class="absolute top-1.5 left-1 right-1 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-100">

                <span class="text-[12px] font-semibold text-white px-1 rounded">
                    {{ filteredMedia[index]?.owner?.split(' ')[0] || '' }}
                </span>

                <div class="flex space-x-1">
                    <!-- Icon -->
                    <button class="flex justify-center items-center w-5 h-5" @click="openAddFriendModal">
                        <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="18" height="18" fill="url(#pattern0_778_2210)" />
                            <defs>
                                <pattern id="pattern0_778_2210" patternContentUnits="objectBoundingBox" width="1"
                                    height="1">
                                    <use xlink:href="#image0_778_2210" transform="scale(0.027027)" />
                                </pattern>
                                <image id="image0_778_2210" width="37" height="37"
                                    xlink:href="data:image/png;base64,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" />
                            </defs>
                        </svg>
                    </button>

                    <button class="flex justify-center items-center w-5 h-5" @click="openTurnIntoVideoModal(item)">
                        <svg width="12" height="12" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="19" height="17" fill="url(#pattern0_778_2212)" />
                            <defs>
                                <pattern id="pattern0_778_2212" patternContentUnits="objectBoundingBox" width="1"
                                    height="1">
                                    <use xlink:href="#image0_778_2212"
                                        transform="matrix(0.0232558 0 0 0.0259918 0 -0.00683995)" />
                                </pattern>
                                <image id="image0_778_2212" width="43" height="39"
                                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAnCAYAAACWn7G7AAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAACugAwAEAAAAAQAAACcAAAAAeaESWAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAABANJREFUWAnNmdtOE1EUhjs9t4qRgwEVwaLEkGC4IHppjIn3voDP6BMYbwSjYBSIQC0EFEFAi0Klp2mnfn/jNAMX2M60na7kZ+05dPY3e9Zee81glEqlZ4FAIGoYxhP8Q3Rb28hAfppF56doo1arzeHfhIEcRVHLssbxN9nZj3rFLgNSgGscvyPYx4DG8LPsuNYrlA4OgYbgC4cZ4hkaMQfoMe0jZCI/LUHnA+gSugVnKUxjBMWRrIYWgX/JwWx9j09/6D8Fx1O61xOXjQg2hORlFbRGWLyIRqPb2uGXVSqVB/Q9CbQNGxJk0AHEsVoO0O/cVdGxv+vNYrF4GAwG846OgwJVimgYkNFCoaBZ6KsBmgQg4oCwBKs4lWzTzFOe9dvEcOap27HaMhjhokXDXjhq3KDzhlu+XjM/cA3LxZPlcnmMx9XPhDwBfgtgrTgdMy+wiutZQKeBPDBN8zXAa7T/dIrWNSyzNRYOhycAfIR+A3iVkb5BrbFFNtkH+rDd0K5hATEY1T6g7iDl6hT+Pn6pWq2+z+fzHxOJxC772hbLXmBtCC2LfWiQER7GD+MHGfUhEvtn0uBePB7PAp3jmCfzAhsAQNnAmV5UsU2jITQFdCYUCi0DvUz7E6er7nBtnmABsAAo07uKDduu0JAm0CTHR/HDhEa/4hl/THgoa2h1MjluPyE2LzZPsBdful5vjBPXKj+vc2P3OF8jnSFzrEcikS9sq7qr/uc6jcOdhK13AqiqOmmKdgY/B3iBbJIlln/VT2ryjzPemvyJ69MUKvabSBxwe/Vr+oLdgjUZzX2oVvHbrHpZYldVXdPxqjvqdBgoHr+iTQZyHZ8mZjfJDlvJZFIr3ZmKj+0LzSvs+dRldyZIzXiBfkALwC6Se7dpnwJcwlfY172RpTPBOmtONgM/kGb6Jo88jV+VmP0ZTtejd22eRhYYlYZ6Faob7T1S1Qob7zikd7kMdcJPtnNeQdWBF1iNqh63ViWloB0AtUqtoGUeudrKo20z17CAVZnVR4ykoPQmPI9fYvLskj+PaJ+0jfLfhVzDsmQWKQnTAFuAHwD9NhaLbRCbLc3wVm7INSyd5FQK4tP4U+BVw3YMVDflGhYwpZ9vuki3rFsrWFvuR7Ca1VLdiD+TCeL8uGAf6qqHo0CHjbRI27BhnSBKR3rEfpvqZOccMM7HbJBYHKDe1DcmLZW+GZM2BcMV1GAQrEZRYaDPntqeQc9JS3pj9c0YNJWTdx0AJQMoLY8C1QFBK04ULwoHP00Dp+9dClWxrGnHAhKsNIa0T2+rvWIavA20ILBXyP4Ipq/dKaS76QVTlaZXoXk0p8/0ep/Xf2sUoypKJME30hltP0yZQDWxvqOJKfcXRsCVG01RuI8AAAAASUVORK5CYII=" />
                            </defs>
                        </svg>
                    </button>

                    <button @click="copyAction(media[index].prompt)" class="flex justify-center items-center w-5 h-5">
                        <svg width="12" height="12" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="19" height="16" fill="url(#pattern0_778_2213)" />
                            <defs>
                                <pattern id="pattern0_778_2213" patternContentUnits="objectBoundingBox" width="1"
                                    height="1">
                                    <use xlink:href="#image0_778_2213"
                                        transform="matrix(0.0221607 0 0 0.0263158 -0.00969529 0)" />
                                </pattern>
                                <image id="image0_778_2213" width="46" height="38"
                                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAmCAYAAAC76qlaAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAC6gAwAEAAAAAQAAACYAAAAAsG/XZAAAAAlwSFlzAAAWJQAAFiUBSVIk8AAABH9JREFUWAnNmL9vHEUUx++nzxfL2G4iIYGIICQFUqgMUpICKgSpEBSUtBQU/CUUFLS0SKCIIkR0FMQSpIgUKQhI40iBiIAwBox9PvuOz2e9cxnf7cj26nLLk97tm+/8eN+ZeTtv9urD4XC53++/WavVPkCfQpVmrvWsVN3PENf7ucriPvphu92+2sJooEvoGXQR/T+LfOXa0FD66L9oTHyXsjOuUtzxuYiAHOVak3i2HfV6vU/YiCnfYK/x3M5K1f104XUR95elkHM0dIZhxcUNGUX2NweDwcfz8/MbGVLRz87Ozkqz2Wzj/hLq6geO2YpP0GJmG91ud32iYvbAJgfHRhQJIwajGYwQDFZ7nsZPxFgVthzkUuS7kDgNxd2iqkUOhRzjGD8RSVbDvkvE4cKJOuaNeX+2MDcJy70y/UsTx9kK8XeFl+flMo7p+y2J5Bp9fyvTvzTxXq+33Gg0XsPpOwnHgxwv3GrqlhnjBs9SxFODJrg8gtniFuGy8giZsBw7Ob59HWOi1zEBOxprO+go+2CbNcWTwtu+xYrfosHTY41OUT6N+lTMdg/zp+UgtxwjFBJP6+USRI5y3ZJ4lol4xsS1xZPCy/UHcXqVlZP8SJjMObC3AV7Mwbus7GeQ/GnUCANs3TFirMAO3EKVvDJurb29vYs4Og/QCbUM+kyO6+wh5YlJgP1D3Xe5hq613d3dVca7RH1GHPsBlV91Op2bo0ZHGPTxdnoaDufkEpqDd9DzcnPF36dS4uGCZWo1xS5C4vO5ubkvsN3uYwkD2zY+4vZy7Fj980YdfL/C7r1F+QIqJ2URrld4nvUFewNjQTSS58G9m/+AfhnhR5oMvEjfOHm1xY7seLiB/V/IuXWjKrPoBfDnfOvjiqhNhjtAmG1cl7QhOdG+CEsOcFDhGPpOcpP45kHbiV9xr7W+DLMWfeo7yS15zs6a6Un9SXwp0UncrZrY+kT7acL61HeSm8RTXznifiZVFSr6TnJr8OJ4atxGzUhBTBrid1AHmLXo807O4W7kXI63xT3HP+J4eZ3Ck9geN67wDfQTznATUA+dtfTw/TWJ5hccv4ueRQ2fv+F6Da7XW8gaqftZCj1A6mA+HN7jyrkGVsVqex0wUz+Ax+8kolcpZ7x4uog/ytkYN71ac1CLkdviZWV8rLLjBG6hf+DZlLhZ0xCJnflfxng2BTqWtFiZUabMbUOyjMhBLkHkKNcFiU9bvJv8yaB+SAxyO767TMVf2ZVIOt/f3/+Vy9F1GtyzESv+vViyQ8mKqRPn+vozXD7lI9otrXHn9ghLpW6blJKpE8/ffL94HqukYtz4rOQoHJutHMJH96GqQuLE6A4r99ehlhUU5CCXIteFocJJsLK9vX2G+Nwo6jQrzD895VLkLyYetsSzcpWZvkfWSl1yisaaOgYHb4iraMgxgWP2b61gk5n5xRHkMtv0EoUqboaBg0+5jRJQzjHLpmHFJX3KlpGMOkRY1aYcswWWuMvvObuO+oGsOKvxe0JWMeMfd9wLV/h75D62XAf/AX/vgZVVhMM0AAAAAElFTkSuQmCC" />
                            </defs>
                        </svg>
                    </button>

                    <button class="flex justify-center items-center w-5 h-5"
                        @click="openSaveBoard(filteredMedia[index].url)">
                        <svg width="12" height="12" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="14" height="17" fill="url(#pattern0_778_2211)" />
                            <defs>
                                <pattern id="pattern0_778_2211" patternContentUnits="objectBoundingBox" width="1"
                                    height="1">
                                    <use xlink:href="#image0_778_2211"
                                        transform="matrix(0.03125 0 0 0.0257353 0 -0.0147059)" />
                                </pattern>
                                <image id="image0_778_2211" width="32" height="40"
                                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAACCgAwAEAAAAAQAAACgAAAAATnuRkwAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAA2tJREFUWAntmFtPE1EQx7st0FJBaBu51Uu5CIJiYqJR3zXx0S/gt/Nj+GpijIlRhFLuFw3IzRak6XXX37/phuM2RCwt6UMn+XfmzM6ZmTPnnE1nrXw+/9rv94/Ztv0SPus4Tp/P5/ODZpBtWVaaWHPEegdf60AxStAJeAIeb0ZU0ycxeoh1Uo3pdCC8QDGOkXBVdJdAfmInrEKhsMVgGHSANNgAv0AzKILTBOgHJRa+q6BRIC7aRPkW/rkyavzPI1b9BrdKQNWPKbBlxNlH/tDZ2fne0DVMLBaLOZy9Mh3qtJsJkJRTMg0aKVd9O4ZPSwnYhkK3oscYN1Ss+na3W77tZt33CyfeTqBdgXYF2hVoyQqY7+oLv9HqNWzJCtS7mLrmtUQFzP8Dda3iMpNaogKXWcCl57Yr0BIVuNI3n/fQmP9Q3WfnJsTf6gBG/TS0MZrLaPVfrq7xKY1mpqur6wg5gz7rOvPwGt/exsRjfzYkeA+BR9BMBQKBGcb3CDpEMCV1AFZp8xYZL/FsE753Nvt8yVsBNSXqXnzV1Q7gNMJqI/A4ge+gnwazmMwQJCxbqIy8DOZJapEOaBWsIx+BdCgU2uOZ/ObBX42PNwGVs5sAIVZ7m0lPGGu1o8g34RF4FB5DHwQuqQqT0vNcyam53UbeJukUyXzk2XqpVLqG3nzzOkqgDFyS42esNsrEBPJzJsqhWvfKjWFcBIc4136fAlEYnc6E5t+QgvFTxj/gC2AEn8tUcpRHsnHJVnuullxfRURyugV+A+nUtmuCm7XKmAJfcZ7E8Q6yD3kIeRrxIZgC3cClDMIuUFW0ZbeA2nRRRgnI4HplWPuTw/khzpXYT/Cd8Qr7uoCc4tRL58PHIGyKFWq7JsAwdgPo1IZrAef5P9YW1FwNdKJjsIizOZwly+WySrgLTweDQa0mjb4oQ2xku8+5mcemD8TQJdBNggfY3WesG+SlyhlQd6xzcAJ0dTIYa4+3wApIcniWCLqBXOB5DaFXIvq2IFQom83G+c4wjq8U+IaNKqNKqSqqTi+onIEvCDpEa/BPGOo67TA+oNQZY7XmYcX034SP3lwup2vcDwYZx4G+Dz0mxhg8q88kui5BsIqcRJlkT3fC4bAqopUVefbfwZknOuUdoKodUpEDKqKzpG9DOoT6SJX/A/c6pkwV7GK0AAAAAElFTkSuQmCC" />
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <PreviewImageModal :isOpen="showPreviewModal" @close="closePreviewModal" :image="selectedImage" />
        <TurnIntoVideoModal :isOpen="showTurnIntoVideoModal" @close="closeTurnIntoVideoModal" :image="selectedImage" />
        <!-- Show SaveBoardComponent when isSaveBoardOpen is true -->
        <SaveBoardComponent v-if="isSaveBoardOpen" @close="closeSaveBoard" :image="imageUrlData"
            @updateAfterSave="updateBoardName"/>
    </div>
</template>