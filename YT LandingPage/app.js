let mainContentContainer = document.querySelector(".mainContentContainer");
let inputField = document.querySelector(".search input");

let allVideos = [];

// TIME AGO FUNCTION
function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    week: 7 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
    second: 1,
  };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return value === 1 ? `${value} ${key} ago` : `${value} ${key}s ago`;
    }
  }
}

// FETCH DATA
fetch("https://api.freeapi.app/api/v1/public/youtube/videos")
  .then((response) => response.json())
  .then((data) => {
    allVideos = data.data.data;
    renderVideos(allVideos);
  });

// RENDER FUNCTION
const renderVideos = (videoData) => {
  mainContentContainer.innerHTML = "";

  videoData.forEach((video) => {
    const link = document.createElement("a");
    link.className = "videoLink";
    link.href = `https://www.youtube.com/watch?v=${video.items.id}`;
    link.target = "_blank";

    const videoCard = document.createElement("div");
    videoCard.className = "video";

    const thumbnail = document.createElement("div");
    thumbnail.className = "thumbnail";

    const img = document.createElement("img");
    img.src = video.items.snippet.thumbnails.high.url;
    img.alt = "videoThumbnail";

    thumbnail.appendChild(img);

    const videoDetails = document.createElement("div");
    videoDetails.className = "videoDetails";

    const videoTitle = document.createElement("div");
    videoTitle.className = "videoTitle";

    const h3 = document.createElement("h3");
    h3.textContent = video.items.snippet.title;

    videoTitle.appendChild(h3);

    const videoInfo = document.createElement("div");
    videoInfo.className = "videoInfo";

    const h4_1 = document.createElement("h4");
    h4_1.textContent = video.items.snippet.channelTitle;

    const publishedTimeText = timeAgo(video.items.snippet.publishedAt);

    const h4_2 = document.createElement("h4");
    h4_2.textContent = `${video.items.statistics.viewCount} views • ${publishedTimeText}`;

    videoInfo.appendChild(h4_1);
    videoInfo.appendChild(h4_2);

    videoDetails.appendChild(videoTitle);
    videoDetails.appendChild(videoInfo);

    videoCard.appendChild(thumbnail);
    videoCard.appendChild(videoDetails);
    link.appendChild(videoCard);
    mainContentContainer.appendChild(link);
  });
};

// FIXED SEARCH FEATURE
inputField.addEventListener("keyup", () => {
  let query = inputField.value.toLowerCase().trim();

  if (query === "") {
    renderVideos(allVideos);
    return;
  }

  let filtered = allVideos.filter(video =>
    video.items.snippet.title.toLowerCase().includes(query)
  );

  renderVideos(filtered);
});
