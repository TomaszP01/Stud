package slideviewerpro.slideviewerpro;

import javafx.beans.property.DoubleProperty;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.media.MediaView;
import javafx.stage.FileChooser;
import javafx.util.Duration;
import javafx.fxml.Initializable;
import java.io.File;
import java.net.URL;
import java.util.ResourceBundle;

import static javafx.beans.binding.Bindings.*;

public class MediaPlayerController implements Initializable {
    @FXML
    private MediaView mediaView;
    @FXML
    private Button playButton, pauseButton, resetButton;
    private File selectedFile;
    private Media media;
    private MediaPlayer mediaPlayer;

    @Override
    public void initialize(URL arg0, ResourceBundle arg1) {
        DoubleProperty width = mediaView.fitWidthProperty();
        DoubleProperty height = mediaView.fitHeightProperty();
        width.bind(selectDouble(mediaView.sceneProperty(), "width"));
        height.bind(selectDouble(mediaView.sceneProperty(), "height"));
    }
    public File chooseFile(){
        FileChooser chooser = new FileChooser();
        FileChooser.ExtensionFilter extFilter = new FileChooser.ExtensionFilter("MP4 files (*.mp4)", "*.mp4");
        chooser.getExtensionFilters().add(extFilter);
        selectedFile = chooser.showOpenDialog(null);
        return selectedFile;
    }
    public void displayMedia(File file){
        String path = file.toURI().toString();
        if (path != null) {
            media = new Media(path);
            mediaPlayer = new MediaPlayer(media);
            mediaView.setMediaPlayer(mediaPlayer);
        }
    }
    public void handlePlayMedia() {
        mediaPlayer.play();
    }
    public void handlePauseMedia() {
        mediaPlayer.pause();
    }
    public void handleResetMedia() {
        if(mediaPlayer.getStatus() != MediaPlayer.Status.READY) {
            mediaPlayer.seek(Duration.seconds(0.0));
        }
    }
    public void handleChooseFile(){
        displayMedia(chooseFile());
    }
}
