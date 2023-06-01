package mediaplayer.mediaplayer;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class MediaPlayer extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(MediaPlayer.class.getResource("MediaPlayer-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 1280, 790);
        stage.setTitle("MediaPlayer");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}