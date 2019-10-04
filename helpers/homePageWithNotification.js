function homePageWithNotification(notificationType, notification) {
  return `/?${notificationType}=${notification}`;
}

module.exports = homePageWithNotification;
