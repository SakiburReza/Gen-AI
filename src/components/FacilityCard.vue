<script setup>

</script>


<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-lg shadow p-6 w-96">
      <div class="grid grid-cols-2 gap-4">
        <!-- Text to Image-->
        <div 
        class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2">
          <span class="text-gray-800 font-medium">Text to Image</span>
        </div>
        <!-- Image to Video -->
        <!-- <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2">
          <span class="text-gray-800 font-medium">Image to Video</span>
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <rect
              width="23"
              height="23"
              transform="matrix(-1 0 0 1 23 0)"
              fill="url(#pattern0_107_1448)"
            />
            <defs>
              <pattern
                id="pattern0_107_1448"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlink:href="#image0_107_1448" transform="scale(0.00571429)" />
              </pattern>
              <image
                id="image0_107_1448"
                width="175"
                height="175"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div> -->

        <!-- Text to Video -->
        <!-- <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2">
          <span class="text-gray-800 font-medium">Text to Video</span>
          <svg
            width="28"
            height="26"
            viewBox="0 0 28 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <rect width="28" height="26" fill="url(#pattern0_107_1449)" />
            <defs>
              <pattern
                id="pattern0_107_1449"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlink:href="#image0_107_1449"
                  transform="matrix(0.00526316 0 0 0.00566802 0 -0.00161943)"
                />
              </pattern>
              <image
                id="image0_107_1449"
                width="190"
                height="177"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div> -->

        <!-- Face Swap -->
        <div 
        class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2">
          <span class="text-gray-800 font-medium">Face Swap</span>
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <rect
              width="23"
              height="23"
              transform="matrix(-1 0 0 1 23 0)"
              fill="url(#pattern0_107_1448)"
            />
            <defs>
              <pattern
                id="pattern0_107_1448"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlink:href="#image0_107_1448" transform="scale(0.00571429)" />
              </pattern>
              <image
                id="image0_107_1448"
                width="175"
                height="175"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div>

        <!-- Templates -->
        <!-- <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 rounded-md p-2">
          <span class="text-gray-800 font-medium">Templates</span>
          <svg
            width="27"
            height="26"
            viewBox="0 0 27 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <rect width="27" height="26" fill="url(#pattern0_107_1451)" />
            <defs>
              <pattern
                id="pattern0_107_1451"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlink:href="#image0_107_1451"
                  transform="matrix(0.00591716 0 0 0.00614474 0 -0.000796541)"
                />
              </pattern>
              <image
                id="image0_107_1451"
                width="169"
                height="163"
                xlink:href="data:image/png;base64,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"
              />
            </defs>
          </svg>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add additional styling if needed */
</style>
