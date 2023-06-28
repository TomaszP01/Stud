package slideviewerpro.slideviewerpro;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class MainController {

    @FXML
    public void WatchAction(ActionEvent actionEvent) throws IOException {
        Stage stage = new Stage();
        FXMLLoader fxmlLoader = new FXMLLoader(Main.class.getResource("MediaPlayer-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("MediaPlayer");
        stage.setScene(scene);
        stage.show();
    }
    @FXML
    public void BrowseAction(ActionEvent actionEvent) throws IOException {
        Stage stage = new Stage();
        FXMLLoader fxmlLoader = new FXMLLoader(Main.class.getResource("ImageViewer-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 1280, 790);
        stage.setTitle("ImageViewer");
        stage.setScene(scene);
        stage.show();
    }
}