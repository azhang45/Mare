import cv2
import sys

image = cv2.imread(sys.argv[1])
# Converting the image to grayscale.
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Using the Canny filter to get contours
# edges = cv2.Canny(gray, 20, 30)
# Using the Canny filter with different parameters
edges_high_thresh = cv2.Canny(gray, 100, 200)
final = 255 - edges_high_thresh
cv2.imwrite(sys.argv[1], final)
print("success")
sys.stdout.flush()