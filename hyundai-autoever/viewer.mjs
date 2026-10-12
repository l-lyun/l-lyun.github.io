import * as pdfjsLib from "../cj-olivenetworks/vendor/pdfjs/pdf.mjs";
import {
  EventBus,
  LinkTarget,
  PDFLinkService,
  PDFViewer,
} from "../cj-olivenetworks/vendor/pdfjs/pdf_viewer.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "../cj-olivenetworks/vendor/pdfjs/pdf.worker.mjs",
  import.meta.url,
).href;

const status = document.getElementById("status");
const eventBus = new EventBus();
const linkService = new PDFLinkService({
  eventBus,
  externalLinkTarget: LinkTarget.BLANK,
  externalLinkRel: "noopener noreferrer",
});
const viewer = new PDFViewer({
  container: document.getElementById("viewerContainer"),
  eventBus,
  linkService,
});

linkService.setViewer(viewer);
eventBus.on("pagesinit", () => {
  viewer.currentScale = 0.6;
});
eventBus.on("pagerendered", ({ pageNumber }) => {
  if (pageNumber === 1) status.hidden = true;
});

try {
  const document = await pdfjsLib.getDocument({
    url: "./pdf/hyundai-autoever.pdf?v=e2951ac3",
  }).promise;
  viewer.setDocument(document);
  linkService.setDocument(document);
} catch (error) {
  console.error("Could not display the portfolio PDF", error);
  status.textContent = "화면 표시가 안 되면 아래 PDF 저장 버튼을 이용해 주세요.";
}
