<template>
  <div>
    <BaseBox class="mb-4" :header="'Artwork Upload'" min-height="0">
      <div>
        <!-- <div class="mt-3">
          {{ selectedProduct ? selectedProduct.id : "-" }}
        </div>
        <div class="mt-3">
          {{ selectedProduct ? selectedProduct.productDisplayName : "-" }}
        </div> -->
        <div class="mt-3 canvas-wrapper">
          <div class="mt-2">
            <div class="button-list">
              <button
                @click="
                  scaleToFit(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    objectModifier,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Scale to Fit
              </button>
              <button
                @click="
                  scaleToCover(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    objectModifier,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Scale to Cover
              </button>
              <button
                @click="
                  rotateCW(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    objectModifier,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Rotate +90°
              </button>
              <button
                @click="
                  rotateACW(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    objectModifier,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Rotate -90°
              </button>
              <button
                @click="
                  sendToBack(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Send to Back
              </button>
              <button
                @click="
                  bringToFront(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Bring to Front
              </button>
              <button
                @click="
                  sendBackwards(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Send Backwards
              </button>
              <button
                @click="
                  bringForward(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Bring Forward
              </button>

              <button
                @click="
                  addPerforationLineHorizontal(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    state.cardSide as string,
                    allPages as inlinePageWithoutRefs[],
                    cardsDataRef as CardDataWithoutRef[]
                  )
                "
              >
                Add Perforation Line Horizontal
              </button>
              <button
                @click="
                  addPerforationLineVertical(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    state.cardSide as string,
                    allPages as inlinePageWithoutRefs[],
                    cardsDataRef as CardDataWithoutRef[]
                  )
                "
              >
                Add Perforation Line Vertical
              </button>
              <button
                @click="
                  deleteActiveObject(
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )
                "
              >
                Delete Active object
              </button>

              <button @click="toggleBleedLines">Toggle Bleed Lines</button>

              <button
                v-if="state.modeType === 'card'"
                @click="unDoCardRef && unDoCardRef()"
              >
                Undo
              </button>
              <button
                v-if="state.modeType === 'card'"
                @click="reDoCardRef && reDoCardRef()"
              >
                Redo
              </button>

              <button
                v-if="state.modeType === 'cover'"
                @click="unDoCoverRef && unDoCoverRef()"
              >
                Undo
              </button>
              <button
                v-if="state.modeType === 'cover'"
                @click="reDoCoverRef && reDoCoverRef()"
              >
                Redo
              </button>

              <button
                v-if="state.modeType === 'page'"
                @click="unDoRef && unDoRef()"
              >
                Undo
              </button>
              <button
                v-if="state.modeType === 'page'"
                @click="reDoRef && reDoRef()"
              >
                Redo
              </button>

              <div class="input-group">
                <button
                  @click="
                    addSVGText(
                      state.modeType,
                      state.currentCNV as currentCanvas[],
                      activePageID,
                      pageSideRef,
                      allPages as inlinePageWithoutRefs[],
                      cardsDataRef as CardDataWithoutRef[],
                      state.cardSide as string,
                      state.activeCover as CoverData
                    )
                  "
                >
                  Add SVG
                </button>
                <button
                  @click="
                    addImage(
                      state.modeType,
                      state.currentCNV as currentCanvas[],
                      activePageID,
                      allPages as inlinePageWithoutRefs[],
                      cardsDataRef as CardDataWithoutRef[],
                      state.cardSide as string,
                      state.activeCover as CoverData
                    )
                  "
                >
                  Add Image
                </button>

                <button
                  @click="
                    addCustomText(
                      state.modeType,
                      state.currentCNV as currentCanvas[],
                      activePageID,
                      pageSideRef,
                      allPages as inlinePageWithoutRefs[],
                      cardsDataRef as CardDataWithoutRef[],
                      state.cardSide as string,
                      state.activeCover as CoverData
                    )
                  "
                >
                  Add text
                </button>
                <input
                  v-model="selectedColor"
                  type="color"
                  class="border border-black"
                  @input="(e)=> changeColor(
                    e,
                    state.modeType,
                    state.currentCNV as currentCanvas[],
                    activePageID,
                    objectModifier,
                    cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string,
                    state.activeCover as CoverData
                  )"
                />

                <input v-model="qrText" placeholder="Enter text or URL" />

                <button
                  @click="
                    generateQRCode(
                      state.modeType,
                      state.currentCNV as currentCanvas[],
                      activePageID,
                      qrText,
                      pageSideRef,
                      currentCanvasRef as inlinePageWithoutRefs[],
                      state.Card as Sides[],
                      allPages as inlinePageWithoutRefs[],
                      cardsDataRef as CardDataWithoutRef[],
                      state.cardSide as string,
                      state.activeCover as CoverData
                    )
                  "
                >
                  Generate QR Code
                </button>
                <!-- <button
                  @click="
                    handlePageMode(
                      state.currentCNV as inlinePage[],
                      activePageID,
                      allPagesCanvasesRef as allPagesCanvasesRef,
                      inlinePages,
                      containerRef,
                      actualSize,
                      state.canvasSize,
                      pageCounter,
                      pageActiveObj as FabricObject | null,
                      history,
                      currentActionIndex
                    );
                    switchToPage();
                  "
                >
                  Page Mode
                </button> -->

                <button @click="switchToPage()">Page Mode</button>

                <!-- <button
                  v-if="state.modeType === 'page'"
                  @click="handlePageCover"
                >
                  Page Cover
                </button> -->

                <button @click="switchToCard()">Card Mode</button>

                <button @click="switchToCover()">Cover Mode</button>

                <div>
                  Move Page From:
                  <input
                    v-model="state.pageSwapFrom"
                    type="number"
                    class="border border-black"
                    placeholder="type page number"
                    @input="swapFrom"
                  />

                  Move Page To:
                  <input
                    v-model="state.pageSwapTo"
                    type="number"
                    class="border border-black"
                    placeholder="type page number"
                    @input="swapTo"
                  />

                  <button
                    v-if="state.pageSwapFrom && state.pageSwapTo"
                    @click="swapPage"
                  >
                    MOVE PAGE
                  </button>
                </div>

                <p v-if="state.pageSide === 'card'">{{ currentSide }}</p>

                <button
                  v-if="state.modeType === 'page'"
                  @click="createNewPageRef && createNewPageRef()"
                >
                  Create New Page
                </button>

                <!-- <button @click="createPage">Create Page</button> -->

                <div>
                  zoom:
                  <input
                    v-model="state.zoomPercentage"
                    type="number"
                    class="border border-black"
                    max="100"
                    min="30"
                    @input="handleZoom"
                  />
                </div>
              </div>

              <div
                v-if="
                  (state.activeObject &&
                    state.activeObject.type === 'textbox') ||
                  (pageActiveObj && pageActiveObj.type === 'textbox')
                "
              >
                <button @click="toggleDropdown">Select Font Family</button>
                <ul v-if="dropdownVisible" class="dropdown">
                  <li
                    v-for="font in fontFamilies"
                    :key="font"
                    class="cursor-pointer hover:bg-gray-100 pl-2"
                    @click="
                      selectFont(
                        font,
                        state.modeType,
                        state.currentCNV as currentCanvas[],
                        activePageID,
                        cardsDataRef as CardDataWithoutRef[],
                        state.cardSide as string,
                        state.activeCover as CoverData
                      )
                    "
                  >
                    {{ font }}
                  </li>
                </ul>
              </div>

              <div
                v-if="
                  (state.activeObject &&
                    state.activeObject.type === 'textbox') ||
                  (pageActiveObj && pageActiveObj.type === 'textbox')
                "
              >
                <button @click="toggleFontStype">Select Font Style</button>
                <ul v-if="fontFamilyVisible" class="dropdown">
                  <li
                    v-for="font in fontStyles"
                    :key="font"
                    class="cursor-pointer hover:bg-gray-100 pl-2"
                    @click="
                      selectFontStyle(
                        font,
                        state.modeType,
                        state.currentCNV as currentCanvas[],
                        activePageID,
                        cardsDataRef as CardDataWithoutRef[],
                        state.cardSide as string,
                        state.activeCover as CoverData
                      )
                    "
                  >
                    {{ font }}
                  </li>
                </ul>
              </div>

              <div
                v-if="
                  (state.activeObject &&
                    state.activeObject.type === 'textbox') ||
                  (pageActiveObj && pageActiveObj.type === 'textbox')
                "
                class="h-12 flex items-center justify-center"
              >
                font size:
                <input
                  v-model="state.fontSize"
                  type="number"
                  max="200"
                  min="5"
                  class="border border-black"
                  placeholder="Enter Font Size"
                  @input="(e)=> handleFontSize(e, state.modeType, state.currentCNV as currentCanvas[], activePageID, cardsDataRef as CardDataWithoutRef[],
                    state.cardSide as string, state.activeCover as CoverData)"
                />
              </div>

              <!-- page thumbnails  -->
              <div
                v-if="state.modeType === 'page'"
                class="w-full relative pt-10 pb-10 flex flex-wrap"
              >
                <div
                  v-for="(page, index) in allPages"
                  :key="index"
                  class="box mr-2 h-fit w-fit mb-5"
                >
                  <div
                    :class="pagesLikeDesign(page as inlinePageWithoutRefs)"
                    class="w-32 h-32 mb-3"
                    @click="
                      loadPageRef && loadPageRef(page as inlinePageWithoutRefs)
                    "
                  >
                    <img
                      :src="
                        allPagesCanvasesRef.thumbnail[page.pageNumber - 1] ===
                        ''
                          ? mockThumbnail
                          : allPagesCanvasesRef.thumbnail[page.pageNumber - 1]
                      "
                      alt="Generated Image"
                      class="w-full h-full"
                      :class="activePage(page as inlinePageWithoutRefs)"
                    />

                    Page:
                    {{
                      page.pageNumber === 1 ||
                      (page.pageNumber === allPages.length &&
                        page.pageNumber !== 2)
                        ? "Cover"
                        : page.pageNumber - 1
                    }}
                  </div>
                </div>
              </div>

              <!-- card thumbnails  -->
              <div
                v-if="state.modeType === 'card'"
                class="w-full relative py-10 flex space-x-2"
              >
                <div
                  :class="activeCardFront(state.cardSide!)"
                  class="w-32 h-32 mb-3 cursor-pointer"
                  @click="selectCard('Front')"
                >
                  <img
                    :src="state.cardThumbs?.cardFront"
                    alt="Generated Image"
                    class="w-full h-full"
                  />

                  Card: Front
                </div>

                <div
                  :class="activeCardBack(state.cardSide!)"
                  class="w-32 h-32 mb-3 cursor-pointer"
                  @click="selectCard('Back')"
                >
                  <img
                    :src="state.cardThumbs?.cardBack"
                    alt="Generated Image"
                    class="w-full h-full"
                  />

                  Card: Back
                </div>
              </div>

              <!-- cover thumbnails  -->
              <div
                v-if="state.modeType === 'cover'"
                class="w-full relative py-10 flex space-x-2"
              >
                <div
                  :class="activeCoverLeft(coverSideRef!)"
                  class="w-32 h-32 mb-3 cursor-pointer"
                  @click="selectCover('Left')"
                >
                  <img
                    :src="state.coverThumbs?.coverLeft"
                    alt="Generated Image"
                    class="w-full h-full"
                  />

                  Cover: Left
                </div>

                <div
                  :class="activeCoverMiddle(coverSideRef!)"
                  class="w-12 h-32 mb-3 cursor-pointer"
                  @click="selectCover('Middle')"
                >
                  <img
                    :src="state.coverThumbs?.coverMiddle"
                    alt="Generated Image"
                    class="w-full h-full"
                  />

                  Cover: Middle
                </div>

                <div
                  :class="activeCoverRight(coverSideRef!)"
                  class="w-32 h-32 mb-3 cursor-pointer"
                  @click="selectCover('Right')"
                >
                  <img
                    :src="state.coverThumbs?.coverRight"
                    alt="Generated Image"
                    class="w-full h-full"
                  />

                  Cover: Right
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-red text-xs">
              {{ state.error }}
            </p>
          </div>

          <!-- <div id="canvas-container" :class="coverModeOnly(state.modeType)">
            <canvas ref="canvasRef"></canvas>
          </div> -->

          <!-- cover container  -->
          <div
            id="cover-container"
            class="flex w-full h-full"
            :class="coverModeOnly(state.modeType)"
          >
            <div id="cover-left" :class="activeCoverLeft(coverSideRef!)">
              <canvas ref="coverLeftRef"></canvas>
            </div>

            <div id="cover-middle" :class="activeCoverMiddle(coverSideRef!)">
              <canvas ref="coverMiddleRef"></canvas>
            </div>

            <div id="cover-right" :class="activeCoverRight(coverSideRef!)">
              <canvas ref="coverRightRef"></canvas>
            </div>
          </div>

          <!-- cards container  -->
          <div
            id="card-container"
            class="flex w-full h-full"
            :class="cardModeOnly(state.modeType)"
          >
            <div id="card-front" :class="hideCard('Front')">
              <canvas ref="cardFrontRef"></canvas>
            </div>

            <div id="card-back" :class="hideCard('Back')">
              <canvas ref="cardBackRef"></canvas>
            </div>
          </div>

          <!-- pages container  -->
          <div class="relative w-[100vw] flex items-center justify-start">
            <div ref="containerRef" :class="pageModeOnly(state.modeType)"></div>
          </div>

          <div>
            <h2>Perforation Lines</h2>
            <div v-if="LineHelper">
              <label>
                Top:
                <input
                  v-model.number="LineHelper.top"
                  type="number"
                  @input="updateLineCoordinatesTop"
                />
              </label>
              <label>
                Left:
                <input
                  v-model.number="LineHelper.left"
                  type="number"
                  @input="updateLineCoordinatesLeft"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </BaseBox>
  </div>
</template>

<script setup lang="ts">
import BaseBox from "@/components/base/BaseBox.vue";
import type { Product } from "~/types/cart.types";
import { onMounted, ref, watch, reactive } from "vue";
import {
  type FabricObject,
  type Canvas,
  type TOriginX,
  type TOriginY,
} from "fabric";
import {
  initializeCanvas,
  fabricCanvas,
  setModeType,
  pageSideRef,
  currentCanvasRef,
  currentCardSideRef,
  cardRef,
  activeObjectRef,
} from "./helpers/canvasInstance";
import type PerforationLinesHelper from "./helpers/perforationLines";
import type CustomTextbox from "./helpers/addText";
import ModifyObjectHelper from "./helpers/modifyObject";
import type CustomLine from "./helpers/customPerforationLine";
import type { Sides } from "./helpers/SidesManager";
import { mockThumbnail } from "../MockData/mockThumbnail";
import {
  addCustomText,
  addImage,
  addPerforationLineHorizontal,
  addPerforationLineVertical,
  addSVGText,
  generateQRCode,
} from "../utils/addObjects";
import {
  handleFontSize,
  selectFont,
  selectFontStyle,
} from "../utils/manageFonts";
import {
  bringForward,
  bringToFront,
  changeColor,
  deleteActiveObject,
  rotateACW,
  rotateCW,
  scaleToCover,
  scaleToFit,
  sendBackwards,
  sendToBack,
} from "../utils/objectInteractions";
import { pageHandler } from "../utils/pagesHandler";
import { cardsHandler } from "../utils/cardsHandler";
import { coverHandler } from "../utils/coverHandler";
import { toggleBleedlines } from "./helpers/bringBleedlinesToFront";

const currentSide = ref("Front");

// INTERFACES START
interface inlinePage {
  pageNumber: number;
  pageID: string;
  thumbnail: Ref<string>;
  canvas: Canvas;
  loading: Ref<boolean>;
}

interface inlinePageWithoutRefs {
  pageNumber: number;
  pageID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface currentCanvas {
  pageNumber: number;
  pageID: string;
  canvas: Canvas;
}

interface History {
  pageNumber: number;
  json: JSON;
}

interface CustomLineOptions extends FabricObject {
  linePosition?: string;
  lineType?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stroke: string;
  strokeDashArray: number[];
  selectable: boolean;
  evented: boolean;
  originX: TOriginX;
  originY: TOriginY;
  opacity: number;
  strokeWidth: number;
  layout: boolean;
  padding: number;
}

interface canvasSize {
  width: number;
  height: number;
}

interface CardData {
  cardSide: string;
  cardID: string;
  canvas: Canvas;
  loading: Ref<boolean>;
}

interface CoverData {
  coverSide: string;
  coverID: string;
  canvas: Canvas;
}

interface cardThumbnail {
  cardFront: string;
  cardBack: string;
}

interface coverThumbnail {
  coverLeft: string;
  coverMiddle: string;
  coverRight: string;
}

interface cardHistory {
  cardSide: string;
  activeObject: CustomLineOptions | null;
  json: JSON;
}

interface coverHistory {
  coverSide: string;
  json: JSON;
}

interface CardDataWithoutRef {
  cardSide: string;
  cardID: string;
  thumbnail: string;
  canvas: Canvas;
  loading: boolean;
}

interface state {
  activeObject: FabricObject | null;
  modeType: string;
  currentPage: string;
  pageSide: string;
  objAdded: FabricObject | null;
  zoomPercentage: number;
  fontSize: number | null;
  pageSwapFrom: number | null;
  pageSwapTo: number | null;
  currentCNV: currentCanvas[];
  error: string | null;
  cardSide: string | null;
  activeCover: CoverData | null;
  Card: Sides[];
  canvasSize: canvasSize | null;
  cardThumbs: cardThumbnail | null;
  coverThumbs: coverThumbnail | null;
  coverHistory: coverHistory[];
}

interface allPagesCanvasesRef {
  canvas: Canvas[];
  thumbnail: string[];
}
// INTERFACES END

const propertiesToInclude = ["id", "linePosition", "lineType"];

// REACTIVE STATES
const state = reactive<state>({
  activeObject: null,
  modeType: "card",
  currentPage: "left",
  pageSide: "default",
  objAdded: null,
  zoomPercentage: 100,
  fontSize: null,
  pageSwapFrom: null,
  pageSwapTo: null,
  currentCNV: [],
  error: null,
  cardSide: null,
  activeCover: null,
  Card: [],
  canvasSize: { width: 0, height: 0 },
  cardThumbs: { cardFront: "", cardBack: "" },
  coverThumbs: { coverLeft: "", coverMiddle: "", coverRight: "" },
  coverHistory: [],
});

const props = defineProps<{
  selectedProduct: Product;
}>();

const productInfo = props.selectedProduct.artworkData.productInfo;
const canvasRef = ref<HTMLCanvasElement | null>(null);
const activePageID = ref<string | null>(null);
const pageActiveObj = ref<FabricObject | null>(null);
const history = ref<History[]>([]);

const currentActionIndex = ref<number>(-1);
const cardHistoryIndexRef = ref<number>(-1);
const coverHistoryIndexRef = ref<number>(-1);

const cardFrontRef = ref<HTMLCanvasElement | null>(null);
const cardBackRef = ref<HTMLCanvasElement | null>(null);

const coverLeftRef = ref<HTMLCanvasElement | null>(null);
const coverMiddleRef = ref<HTMLCanvasElement | null>(null);
const coverRightRef = ref<HTMLCanvasElement | null>(null);

const coverSideRef = ref<string>("");

let LineHelper: CustomLine;
let objectModifier: ModifyObjectHelper;
let perforationLinesHelper: PerforationLinesHelper;
// const inlinePages: inlinePage[] = [];
const allPagesCanvasesRef = ref<allPagesCanvasesRef>({
  canvas: [],
  thumbnail: [],
});

const bleedLineTogglerRef = ref<boolean>(true);

const allPages = ref<inlinePage[]>([]);

const containerRef = ref<HTMLElement | null>(null);
const pageCounter = ref<number>(0);

// CSS CONDITIONS start
const activePage = computed(() => (page: inlinePageWithoutRefs) => ({
  "border-2 border-green-500 p-0 cursor-pointer flex justify-between":
    page.pageID === activePageID.value,
  "border-2 border-black p-0 cursor-pointer flex justify-between":
    page.pageID !== activePageID.value,
}));

const pagesLikeDesign = computed(() => (page: inlinePageWithoutRefs) => ({
  "-ml-[7px] mr-5": page.pageNumber % 2 === 0,
}));

// const pageCover = computed(() => (page: inlinePageWithoutRefs) => ({
//   "space-y-2 flex flex-col absolute top-0 left-5": page.pageNumber === 1,
//   "space-y-2 flex flex-col absolute top-0 left-40 ":
//     page.pageNumber === allPages.value.length && page.pageNumber !== 2,
// }));

const cardModeOnly = computed(() => (mode: string) => ({
  "mt-2  hidden": mode === "page" || mode === "cover",
  "mt-2 ": mode == "card",
}));

const coverModeOnly = computed(() => (mode: string) => ({
  "mt-2  hidden": mode == "page" || mode === "card",
  "mt-2 ": mode == "cover",
}));

const pageModeOnly = computed(() => (mode: string) => ({
  "parentContainer mt-2 hidden": mode == "card" || mode === "cover",
  "parentContainer mt-2 grid grid-flow-row grid-cols-2 h-full": mode == "page",
}));

const activeCardFront = computed(() => (cardSide: string) => ({
  "border-2 border-green-500": cardSide === "Front",
  "border-2 border-black": cardSide !== "Front",
}));

const activeCardBack = computed(() => (cardSide: string) => ({
  "border-2 border-green-500": cardSide === "Back",
  "border-2 border-black": cardSide !== "Back",
}));

const hideCard = computed(() => (cardSide: string) => ({
  "border-2 border-black": state.cardSide === cardSide,
  "border-2 border-black hidden": state.cardSide !== cardSide,
}));

const activeCoverLeft = computed(() => (coverSide: string) => ({
  "border-2 border-green-500": coverSide === "Left",
  "border border-gray-400": coverSide !== "Left",
}));

const activeCoverMiddle = computed(() => (coverSide: string) => ({
  "border-2 border-green-500": coverSide === "Middle",
  "border border-gray-400": coverSide !== "Middle",
}));

const activeCoverRight = computed(() => (coverSide: string) => ({
  "border-2 border-green-500": coverSide === "Right",
  "border border-gray-400": coverSide !== "Right",
}));
// CSS CONDITIONS End

// FONT DROPDOWN TRIGGERS
const dropdownVisible = ref(false);
const fontFamilyVisible = ref(false);

const fontFamilies = ref([
  "Arial",
  "Lato",
  "Times New Roman",
  "Courier New",
  "Verdana",
]);
const fontStyles = ref(["normal", "italic"]);

const selectedColor = ref<string>("#000000");
const qrText = ref<string>("");
const selectedLine = ref<FabricObject | null>(null);
const lineProps = ref<{ top: number; left: number }>({ top: 0, left: 0 });

// MODE TYPE TRIGGERS
const pageModeRef = ref<() => Promise<void>>();
const cardModeRef = ref<() => Promise<void>>();
const coverModeRef = ref<() => Promise<void>>();

const cardHistoryRef = ref<cardHistory[]>([]);

const createNewPageRef = ref<() => Promise<void>>();
const loadPageRef = ref<(page: inlinePageWithoutRefs) => void>();
const unDoRef = ref<() => Promise<void>>();
const reDoRef = ref<() => Promise<void>>();

const unDoCardRef = ref<() => Promise<void>>();
const reDoCardRef = ref<() => Promise<void>>();

const unDoCoverRef = ref<() => Promise<void>>();
const reDoCoverRef = ref<() => Promise<void>>();

const cardsDataRef = ref<CardData[]>([]);
const coverDataRef = ref<CoverData[]>([]);

// CARD MODE INITIATER AND WATCHERS
onMounted(() => {
  if (cardFrontRef.value || cardBackRef.value) {
    const { fabricCanvas } = initializeCanvas(canvasRef.value!, productInfo);

    const {
      initiateCards,
      undoCardHistory,
      reDoCardHistory,
      cardsData,
      activeObjectRef,
      cardFrontThumbnail,
      cardBackThumbnail,
      cardHistory,
      cardHistoryIndex,
      canvasDimensionsRef,
      activeCardRef,
    } = cardsHandler(cardFrontRef, cardBackRef, resizeElement, state.modeType);

    objectModifier = new ModifyObjectHelper();

    cardModeRef.value = initiateCards;
    unDoCardRef.value = undoCardHistory;
    reDoCardRef.value = reDoCardHistory;

    // handleCardMode();

    setTimeout(() => {
      switchToCard();
      state.cardSide = "Front";
    }, 0);

    watch(activeCardRef, (newVal) => {
      if (newVal) {
        state.cardSide = newVal;
      }
    });

    watch(canvasDimensionsRef, (newVal) => {
      if (newVal) {
        state.canvasSize = newVal;
      }
    });

    watch(cardHistoryIndex, (newVal) => {
      if (newVal) {
        cardHistoryIndexRef.value = cardHistoryIndex.value;
        cardHistoryRef.value = cardHistory.value;

        const cardsInfo: {
          cardSide: string;
          cardID: string;
          cardJSON: JSON;
        }[] = [];
        cardsData.value.map((card) => {
          cardsInfo.push({
            cardSide: card.cardSide,
            cardID: card.cardID,
            cardJSON: card.canvas.toObject(propertiesToInclude),
          });
        });

        localStorage.removeItem("cardsInfo");
        // const historyString = JSON.stringify(cardsInfo);
        // localStorage.setItem("cardsInfo", historyString);
      }
    });

    watch(cardFrontThumbnail, (newVal) => {
      if (newVal && state.cardThumbs) {
        state.cardThumbs.cardFront = newVal;
      }
    });

    watch(cardBackThumbnail, (newVal) => {
      if (newVal && state.cardThumbs) {
        state.cardThumbs.cardBack = newVal;
      }
    });

    watch(cardsData, (newVal) => {
      if (newVal) {
        cardsDataRef.value = newVal;
      }
    });

    watch(activeObjectRef, (newVal) => {
      if (newVal) {
        state.activeObject = newVal;
      }
    });

    fabricCanvas.renderAll();

    // historyEventHelper = new HistoryEventHelper(fabricCanvas);
  }
});

// COVER MODE INITIATER AND WATCHERS
onMounted(() => {
  if (coverLeftRef.value) {
    const {
      initiateCover,
      undoCoverHistory,
      redoCoverHistory,
      coversData,
      activeObjectRef,
      coverLeftThumbnail,
      coverMiddleThumbnail,
      coverRightThumbnail,
      coverHistory,
      coverHistoryIndex,
      canvasDimensionsRef,
      activeCoverRef,
    } = coverHandler(
      coverLeftRef,
      coverMiddleRef,
      coverRightRef,
      resizeElement,
      state.modeType
    );

    objectModifier = new ModifyObjectHelper();

    coverModeRef.value = initiateCover;
    unDoCoverRef.value = undoCoverHistory;
    reDoCoverRef.value = redoCoverHistory;

    watch(activeCoverRef, (newVal) => {
      if (newVal) {
        coverSideRef.value = newVal;
      }
    });

    watch(coverSideRef, (newVal) => {
      if (newVal) {
        const activeCov = coverDataRef.value.find((cov) => {
          return cov.coverSide === newVal;
        });

        state.activeCover = activeCov as CoverData;
      }
    });

    watch(canvasDimensionsRef, (newVal) => {
      if (newVal) {
        state.canvasSize = newVal;
      }
    });

    watch(coverHistoryIndex, (newVal) => {
      if (newVal) {
        coverHistoryIndexRef.value = coverHistoryIndex.value;
        state.coverHistory = coverHistory.value;

        const coverInfo: {
          coverSide: string;
          coverID: string;
          coverJSON: JSON;
        }[] = [];

        coversData.value.map((cover) => {
          coverInfo.push({
            coverSide: cover.coverSide,
            coverID: cover.coverID,
            coverJSON: cover.canvas.toObject(propertiesToInclude),
          });
        });

        localStorage.removeItem("coverInfo");
        // const historyString = JSON.stringify(coverInfo);
        // localStorage.setItem("coverInfo", historyString);
      }
    });

    watch(coverLeftThumbnail, (newVal) => {
      if (newVal && state.coverThumbs) {
        state.coverThumbs.coverLeft = newVal;
      }
    });

    watch(coverMiddleThumbnail, (newVal) => {
      if (newVal && state.coverThumbs) {
        state.coverThumbs.coverMiddle = newVal;
      }
    });

    watch(coverRightThumbnail, (newVal) => {
      if (newVal && state.coverThumbs) {
        state.coverThumbs.coverRight = newVal;
      }
    });

    watch(coversData, (newVal) => {
      if (newVal) {
        coverDataRef.value = newVal;
      }
    });

    watch(activeObjectRef, (newVal) => {
      if (newVal) {
        state.activeObject = newVal;
      }
    });
  }
});

// PAGE MODE INITIATER AND WATCHERS
onMounted(() => {
  if (containerRef.value) {
    const {
      PageMode,
      loadPage,
      createNewPage,
      undoPagesHistory,
      redoPagesHistory,
      reactivePages,
      liveCanvases,
      apID,
      allThumbnailsRef,
      canvasSize,
      pgCounter,
      pgActiveObj,
      pagesHistory,
      historyIndex,
    } = pageHandler(containerRef.value, resizeElement);

    pageModeRef.value = PageMode;
    loadPageRef.value = loadPage;
    createNewPageRef.value = createNewPage;
    unDoRef.value = undoPagesHistory;
    reDoRef.value = redoPagesHistory;

    allPages.value = reactivePages.value;

    watch(apID, (newVal) => {
      if (newVal) {
        activePageID.value = apID.value;
      }
    });

    watch(liveCanvases, (newVal) => {
      if (newVal) {
        state.currentCNV = liveCanvases.value;
        currentCanvasRef.value = liveCanvases.value;
      }
    });

    watch(pgActiveObj, (newVal) => {
      if (newVal) {
        pageActiveObj.value = pgActiveObj.value;
      }
    });

    watch(historyIndex, (newVal) => {
      if (newVal) {
        currentActionIndex.value = historyIndex.value;
        history.value = pagesHistory.value;

        const pagesInfo: {
          pageNumber: number;
          pageID: string;
          pageJSON: JSON;
        }[] = [];
        allPages.value.map((p) => {
          pagesInfo.push({
            pageNumber: p.pageNumber,
            pageID: p.pageID,
            pageJSON: p.canvas.toObject(propertiesToInclude),
          });
        });

        localStorage.removeItem("pagesInfo");
        // const historyString = JSON.stringify(pagesInfo);
        // localStorage.setItem("pagesInfo", historyString);
      }
    });

    watch(reactivePages, (newVal) => {
      if (newVal && allThumbnailsRef.value) {
        allPages.value = newVal;
        allPagesCanvasesRef.value = allThumbnailsRef.value;
        state.canvasSize = canvasSize.value;
        pageCounter.value = pgCounter.value;
      }
    });

    watch(liveCanvases, (newVal) => {
      if (newVal) {
        let dynamicValue1;
        let dynamicValue2;

        if (
          newVal[0] &&
          newVal[0].pageNumber &&
          newVal[0].pageNumber % 2 === 0
        ) {
          dynamicValue1 = newVal[1].pageNumber;
          dynamicValue2 = newVal[0].pageNumber;
        } else if (newVal[0].pageNumber && newVal[0].pageNumber % 2 !== 0) {
          dynamicValue1 = newVal[0].pageNumber;
          dynamicValue2 = newVal[1].pageNumber;
        }

        const dynamicIndexNumer1 = dynamicValue1 && dynamicValue1 - 1;
        const dynamicIndexNumer2 = dynamicValue2 && dynamicValue2 - 1;

        const container = containerRef.value;
        if (container && container.children) {
          const childrenArray = Array.from(container.children);

          childrenArray.map((child, i) => {
            if (dynamicIndexNumer1 !== i && dynamicIndexNumer2 !== i) {
              child.className = "containerCanvases hidden";
            } else {
              if (
                dynamicIndexNumer1 &&
                dynamicIndexNumer2 &&
                dynamicIndexNumer1 > dynamicIndexNumer2
              ) {
                childrenArray[dynamicIndexNumer1].className =
                  "containerCanvases col-start-1 row-start-1 ";
                childrenArray[dynamicIndexNumer2].className =
                  "containerCanvases col-start-2 row-start-1 ";
              } else {
                child.className = "containerCanvases flex ";
              }
            }
          });
        }
      }
    });
  }
});

// CANVASES RESIZER BASED ON BROWSER WINDOW SIZE
const resizeElement = () => {
  if (containerRef.value && state.modeType === "page" && state.canvasSize) {
    const widthPercentage =
      (state.canvasSize.width / window.screen.width) * 100;

    const width = `${window.innerWidth * (widthPercentage / 100)}`;

    const height = width;

    const zoomFactor = Math.floor(parseInt(width)) / state.canvasSize.width;

    allPages.value.map((p) => {
      p.canvas.setDimensions({
        width: parseInt(width),
        height: parseInt(height),
      });

      p.canvas.setZoom(zoomFactor);
      p.canvas.requestRenderAll();
    });
  } else if (
    cardFrontRef.value &&
    state.modeType === "card" &&
    state.canvasSize
  ) {
    const widthPercentage =
      (state.canvasSize.width / window.screen.width) * 100;

    const width = `${window.innerWidth * (widthPercentage / 100)}`;

    const height = width;

    const zoomFactor = Math.floor(parseInt(width)) / state.canvasSize.width;

    cardsDataRef.value.map((card) => {
      card.canvas.setDimensions({
        width: parseInt(width),
        height: parseInt(height),
      });

      card.canvas.setZoom(zoomFactor);
      card.canvas.requestRenderAll();
    });
  } else {
    if (state.canvasSize) {
      const widthPercentage =
        (state.canvasSize.width / window.screen.width) * 100;

      const widthPercentageMiddle =
        (state.canvasSize.width / window.screen.width) * 100;

      const width = `${window.innerWidth * (widthPercentage / 100)}`;

      const widthMiddle = `${
        window.innerWidth * ((widthPercentageMiddle - 20) / 100)
      }`;

      const height = width;

      const zoomFactor = Math.floor(parseInt(width)) / state.canvasSize.width;

      coverDataRef.value.map((cover) => {
        if (cover.coverSide === "Middle") {
          cover.canvas.setDimensions({
            width: parseInt(widthMiddle),
            height: parseInt(height),
          });
        } else {
          cover.canvas.setDimensions({
            width: parseInt(width),
            height: parseInt(height),
          });
        }

        cover.canvas.setZoom(zoomFactor);
        cover.canvas.requestRenderAll();
      });
    }
  }
};

// resize on mount
onMounted(() => {
  resizeElement();
  window.addEventListener("resize", resizeElement);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeElement);
});

const switchToPage = () => {
  currentSide.value = "Page Mode";
  state.modeType = "page";

  setModeType(state.modeType);

  if (pageModeRef.value) {
    pageModeRef.value();
  }
};

const switchToCard = () => {
  currentSide.value = "Card Mode";
  state.modeType = "card";

  setModeType(state.modeType);

  cardsDataRef.value.forEach((card) => {
    card.canvas.dispose();
  });

  if (cardModeRef.value) {
    cardModeRef.value();
  }
};

const switchToCover = () => {
  currentSide.value = "Cover Mode";
  state.modeType = "cover";

  coverDataRef.value.forEach((cover) => {
    cover.canvas.dispose();
  });

  if (coverModeRef.value) {
    coverModeRef.value();
  }
};

const swapFrom = (e: Event) => {
  const value = e.target as HTMLInputElement;
  const pageNumber = parseInt(value.value);
  state.pageSwapFrom = pageNumber;
};

const swapTo = (e: Event) => {
  const value = e.target as HTMLInputElement;
  const pageNumber = parseInt(value.value);
  state.pageSwapTo = pageNumber;
};

const swapPage = async () => {
  const activeCanvas = state.currentCNV.find((cnv) => {
    return cnv.pageID === activePageID.value;
  });

  if (activeCanvas) {
    const fabricCanvas = activeCanvas.canvas;

    fabricCanvas &&
      fabricCanvas.getObjects().forEach((obj) => {
        if (fabricCanvas && obj.id && obj.id === "firstPageCover") {
          fabricCanvas.remove(obj);
          fabricCanvas.requestRenderAll();
        }
      });
  }

  if (
    state.pageSwapFrom &&
    state.pageSwapFrom >= 1 &&
    state.pageSwapFrom < allPages.value.length &&
    state.pageSwapTo &&
    state.pageSwapTo >= 1 &&
    state.pageSwapTo < allPages.value.length
  ) {
    const pageNumber = state.pageSwapFrom + 1;
    state.error = null;

    let page1From;
    let page2From;
    let page1To;
    let page2To;

    const inlineIndex = allPages.value.findIndex((p) => {
      if (p) return p.pageNumber === pageNumber;
    });

    if (pageNumber && pageNumber % 2 === 0) {
      page1From = inlineIndex;
      page2From = inlineIndex + 1;
    } else {
      page1From = inlineIndex - 1;
      page2From = inlineIndex;
    }

    const pageSwapTo = state.pageSwapTo + 1;

    const inlineIndexTo = allPages.value.findIndex((p) => {
      return p.pageNumber === pageSwapTo;
    });

    if (pageSwapTo % 2 === 0) {
      page1To = inlineIndexTo;
      page2To = inlineIndexTo + 1;
    } else {
      page1To = inlineIndexTo - 1;
      page2To = inlineIndexTo;
    }

    const canvasesFrom = [
      allPagesCanvasesRef.value.canvas[page1From],
      allPagesCanvasesRef.value.canvas[page2From],
    ];

    const canvasesTo = [
      allPagesCanvasesRef.value.canvas[page1To],
      allPagesCanvasesRef.value.canvas[page2To],
    ];

    const canvasesJsonFrom = [
      allPagesCanvasesRef.value.canvas[page1From].toObject(propertiesToInclude),
      allPagesCanvasesRef.value.canvas[page2From].toObject(propertiesToInclude),
    ];

    const canvasesJsonTo = [
      allPagesCanvasesRef.value.canvas[page1To].toObject(propertiesToInclude),
      allPagesCanvasesRef.value.canvas[page2To].toObject(propertiesToInclude),
    ];

    canvasesTo[0].clear();
    canvasesTo[1].clear();

    await canvasesTo[0].loadFromJSON(canvasesJsonFrom[0]).then(() => {
      canvasesTo[0].requestRenderAll();
    });

    await canvasesTo[1].loadFromJSON(canvasesJsonFrom[1]).then(() => {
      canvasesTo[1].requestRenderAll();
    });

    canvasesFrom[0].clear();
    canvasesFrom[1].clear();

    await canvasesFrom[0].loadFromJSON(canvasesJsonTo[0]).then(() => {
      canvasesFrom[0].requestRenderAll();
    });

    await canvasesFrom[1].loadFromJSON(canvasesJsonTo[1]).then(() => {
      canvasesFrom[1].requestRenderAll();
    });

    if (fabricCanvas) fabricCanvas.renderAll();
  } else {
    state.error = "Choose any other pages";
  }
  if (loadPageRef.value)
    loadPageRef.value(allPages.value[0] as inlinePageWithoutRefs);
};

const handleZoom = (e: Event) => {
  const val = e.target as HTMLInputElement;
  const newValue = parseInt(val.value);

  state.zoomPercentage = newValue;

  const zoom = newValue / 100;

  if (state.modeType === "page") {
    if (state.currentCNV && state.canvasSize) {
      const width = state.canvasSize.width;
      const height = width;

      state.currentCNV.map((activePages) => {
        activePages.canvas.setDimensions({
          width: (width / 100) * newValue,
          height: (height / 100) * newValue,
        });

        activePages.canvas.setZoom(zoom);

        activePages.canvas.renderAll();
      });
    }
  } else if (state.modeType === "card") {
    const activeCard = cardsDataRef.value.find((card) => {
      return state.cardSide === card.cardSide;
    });

    if (activeCard && state.canvasSize) {
      const width = state.canvasSize.width;
      const height = width;

      activeCard.canvas.setDimensions({
        width: (width / 100) * newValue,
        height: (height / 100) * newValue,
      });

      activeCard.canvas.setZoom(zoom);

      activeCard.canvas.renderAll();
    }
  } else {
    coverDataRef.value.map((cover) => {
      if (state.canvasSize && cover.canvas) {
        const width = state.canvasSize.width;
        const height = width;

        if (width && height && cover) {
          if (cover.coverSide === "Middle") {
            cover.canvas.setDimensions({
              width: (width / 3 / 100) * newValue,
              height: (height / 100) * newValue,
            });
          } else {
            cover.canvas.setDimensions({
              width: (width / 100) * newValue,
              height: (height / 100) * newValue,
            });
          }
        }

        cover.canvas.setZoom(zoom);
        cover.canvas.renderAll();
      }
    });
  }
};

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const toggleFontStype = () => {
  fontFamilyVisible.value = !fontFamilyVisible.value;
};

const selectCard = (cardSide: string) => {
  state.cardSide = cardSide;
  // setCardSide(cardSide);
  // switchSide();
};

const selectCover = (coverSide: string) => {
  coverSideRef.value = coverSide;
};

//Button ToggleBleedLines
const toggleBleedLines = () => {
  if (state.modeType === "card") {
    bleedLineTogglerRef.value =
      bleedLineTogglerRef.value === true ? false : true;

    cardsDataRef.value.map((card) => {
      const canvas = card.canvas;

      toggleBleedlines(canvas as Canvas, bleedLineTogglerRef.value);

      if (card.cardSide === "Front" && state.cardThumbs) {
        state.cardThumbs.cardFront = card.canvas.toDataURL();
      } else {
        if (state.cardThumbs) {
          state.cardThumbs.cardBack = card.canvas.toDataURL();
        }
      }
    });
  }
};

const updateLineCoordinatesLeft = (e: Event) => {
  const value = e.target as HTMLInputElement;
  LineHelper.set({
    left: value,
  });

  if (fabricCanvas) fabricCanvas.requestRenderAll();
};

const updateLineCoordinatesTop = (e: Event) => {
  const value = e.target as HTMLInputElement;
  LineHelper.set({
    top: value,
  });

  if (fabricCanvas) fabricCanvas.requestRenderAll();
};

watch(activeObjectRef, (newValue) => {
  if (newValue) {
    if (newValue.type === "textbox" && state.modeType === "card") {
      state.activeObject = newValue;
      const textbox = newValue as CustomTextbox;
      state.fontSize = textbox.fontSize;
    }
  }
});

watch(pageSideRef, (newSide) => {
  if (newSide) {
    state.pageSide = newSide;
  }
});

watch(currentCardSideRef, (newSide) => {
  if (newSide) {
    state.cardSide = newSide;
  }
});

watch(cardRef, (newVal) => {
  if (newVal) {
    state.Card = newVal;
  }
});

watch(selectedLine, (newVal) => {
  if (newVal) {
    lineProps.value.top = newVal.top || 0;
    lineProps.value.left = newVal.left || 0;
  }
});

watch(
  () => lineProps.value.top,
  () => {
    perforationLinesHelper.updateLineCoordinates();
  }
);
watch(
  () => lineProps.value.left,
  () => {
    perforationLinesHelper.updateLineCoordinates();
  }
);
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
.canvas-wrapper {
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid #000;
  }
}
.button-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  button {
    flex: 1;
    min-width: 150px;
    padding: 10px;
    margin: 5px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #5a6268;
    }

    &:active {
      background-color: #545b62;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.5);
    }
  }
}

.input-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  input[type="text"],
  input[type="color"] {
    flex: 1;
    min-width: 150px;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }

  input[type="color"] {
    padding: 0;
    height: 70px;
    cursor: pointer;
  }

  .input-placeholder {
    font-size: 14px;
    color: #495057;
  }
}
</style>
