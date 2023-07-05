package slideviewerpro.slideviewerpro;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.beans.property.DoubleProperty;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.ComboBox;
import javafx.scene.control.Slider;
import javafx.scene.control.TextInputDialog;
import javafx.scene.layout.StackPane;
import javafx.stage.DirectoryChooser;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.stage.Stage;
import javafx.stage.Window;
import javafx.util.Duration;

import static javafx.beans.binding.Bindings.selectDouble;

public class ImageViewerController {
    @FXML
    private StackPane imageContainer;
    @FXML
    private ComboBox<String> imageComboBox = new ComboBox<>();
    private List<File> imageFiles;
    private int currentImageIndex;
    private Timeline slideshowTimer;

    public void initialize() {
        imageFiles = new ArrayList<>();
        currentImageIndex = 0;
        slideshowTimer = new Timeline();
        slideshowTimer.setCycleCount(Timeline.INDEFINITE);
    }
    @FXML
    private void handleSelectFolderButton(ActionEvent actionEvent) {
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
    private void handleSetIntervalsButton(ActionEvent actionEvent){
        TextInputDialog dialog = new TextInputDialog();
        dialog.setTitle("Enter Number");
        dialog.setHeaderText(null);
        dialog.setContentText("Enter a number:");

        Optional<String> result = dialog.showAndWait();

        result.ifPresent(number -> {
            try {
                int parsedNumber = Integer.parseInt(number);
                configureSlideshowTimer(parsedNumber);
            } catch (NumberFormatException e){}
        });
    }
    private void configureSlideshowTimer(int interval) {
        slideshowTimer.stop();
        slideshowTimer.getKeyFrames().clear();
        slideshowTimer.getKeyFrames().add(new KeyFrame(Duration.seconds(interval), this::handleNextButton));
    }
    @FXML
    private void handleFirstButton(ActionEvent actionEvent){
        if (!imageFiles.isEmpty()) {
            currentImageIndex = 0;
            displayImage(imageFiles.get(currentImageIndex));
        }
    }
    @FXML
    private void handleNextButton(ActionEvent actionEvent) {
        if (!imageFiles.isEmpty()) {
            currentImageIndex = currentImageIndex + 1;
            if (currentImageIndex >= imageFiles.size()) {
                currentImageIndex = 0;
            }
            displayImage(imageFiles.get(currentImageIndex));
        }
    }
    @FXML
    private void handlePlayStopButton(ActionEvent actionEvent) {
        if (!imageFiles.isEmpty()) {
            if (slideshowTimer.getStatus() == Timeline.Status.RUNNING) {
                slideshowTimer.stop();
            } else {
                slideshowTimer.play();
            }
        }
    }
    @FXML
    private void handlePreviousButton(ActionEvent actionEvent) {
        if (!imageFiles.isEmpty()) {
            currentImageIndex = currentImageIndex - 1;
            if (currentImageIndex < 0) {
                currentImageIndex = imageFiles.size() - 1;
            }
            displayImage(imageFiles.get(currentImageIndex));
        }
    }
    @FXML
    private void handleLastButton(ActionEvent actionEvent){
        currentImageIndex = imageFiles.size() - 1;
        displayImage(imageFiles.get(currentImageIndex));
    }
    @FXML
    private void handleCloseButton(ActionEvent actionEvent){
        Stage stage = (Stage) imageContainer.getScene().getWindow();
        stage.close();
    }
    @FXML
    private void handleComboBox(){
        int selectedIndex = imageComboBox.getSelectionModel().getSelectedIndex();
        if (selectedIndex >= 0 && selectedIndex < imageFiles.size()) {
            File selectedFile = imageFiles.get(selectedIndex);
            displayImage(selectedFile);
        }
    }
    private void findImageFiles(File folder) {
        imageFiles.clear();
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isFile() && isImageFile(file)) {
                    imageFiles.add(file);
                    imageComboBox.getItems().add(file.getName());
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
