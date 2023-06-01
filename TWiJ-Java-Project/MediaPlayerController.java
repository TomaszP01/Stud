package mediaplayer.mediaplayer;

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

public class MediaPlayerController implements Initializable {

    @FXML
    private MediaView mediaView;

    @FXML
    private Button playButton, pauseButton, resetButton;

    private File file;
    private Media media;
    private MediaPlayer mediaPlayer;

    @Override
    public void initialize(URL arg0, ResourceBundle arg1) {

        FileChooser chooser = new FileChooser();
        FileChooser.ExtensionFilter extFilter = new FileChooser.ExtensionFilter("MP4 files (*.mp4)", "*.mp4");
        chooser.getExtensionFilters().add(extFilter);
        file = chooser.showOpenDialog(null);
        String path = file.toURI().toString();
        if (path != null) {
            media = new Media(path);
            mediaPlayer = new MediaPlayer(media);
            mediaView.setMediaPlayer(mediaPlayer);
        }
    }

    public void playMedia() {
        mediaPlayer.play();
    }

    public void pauseMedia() {
        mediaPlayer.pause();
    }

    public void resetMedia() {
        if(mediaPlayer.getStatus() != MediaPlayer.Status.READY) {
            mediaPlayer.seek(Duration.seconds(0.0));
        }
    }

    public void chooseFile(){
        FileChooser chooser = new FileChooser();
        FileChooser.ExtensionFilter extFilter = new FileChooser.ExtensionFilter("MP4 files (*.mp4)", "*.mp4");
        chooser.getExtensionFilters().add(extFilter);
        file = chooser.showOpenDialog(null);
        String path = file.toURI().toString();
        if (path != null) {
            mediaPlayer.dispose();
            media = new Media(path);
            mediaPlayer = new MediaPlayer(media);
            mediaView.setMediaPlayer(mediaPlayer);
        }
    }
}