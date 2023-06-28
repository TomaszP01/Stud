package slideviewerpro.slideviewerpro;

import javafx.beans.property.DoubleProperty;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.DirectoryChooser;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import static javafx.beans.binding.Bindings.selectDouble;

public class ImageViewerController {
    @FXML
    private Button selectFolderButton;
    @FXML
    private StackPane imageContainer;
    private List<File> imageFiles;
    private int currentImageIndex;

    public void initialize() {
        imageFiles = new ArrayList<>();
        currentImageIndex = 0;
    }
    @FXML
    private void handleSelectFolderButton(ActionEvent event) {
        DirectoryChooser directoryChooser = new DirectoryChooser();
        File selectedFolder = directoryChooser.showDialog(null);

        if (selectedFolder != null) {
            findImageFiles(selectedFolder);

            if (!imageFiles.isEmpty()) {
                displayImage(imageFiles.get(currentImageIndex));
            }
        }
    }
    @FXML
    private void handleNextButton(ActionEvent event) {
        if (!imageFiles.isEmpty()) {
            currentImageIndex = currentImageIndex + 1;
            if (currentImageIndex >= imageFiles.size()) {
                currentImageIndex = 0;
            }
            displayImage(imageFiles.get(currentImageIndex));
        }
    }
    @FXML
    private void handlePreviousButton(ActionEvent event) {
        if (!imageFiles.isEmpty()) {
            currentImageIndex = currentImageIndex - 1;
            if (currentImageIndex < 0) {
                currentImageIndex = imageFiles.size() - 1;
            }
            displayImage(imageFiles.get(currentImageIndex));
        }
    }
    private void findImageFiles(File folder) {
        imageFiles.clear();
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile() && isImageFile(file)) {
                    imageFiles.add(file);
                }
            }
        }
    }
    private boolean isImageFile(File file) {
        String name = file.getName().toLowerCase();
        return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
    }
    @FXML
    private void displayImage(File file) {
        Image image = new Image(file.toURI().toString());
        ImageView imageView = new ImageView(image);

        imageView.setPreserveRatio(true);
        DoubleProperty width = imageView.fitWidthProperty();
        DoubleProperty height = imageView.fitHeightProperty();
        width.bind(selectDouble(imageView.sceneProperty(), "width"));
        height.bind(selectDouble(imageView.sceneProperty(), "height"));

        imageContainer.getChildren().setAll(imageView);
    }
}
