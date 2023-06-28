module slideviewerpro.slideviewerpro {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires javafx.media;
    requires java.desktop;


    opens slideviewerpro.slideviewerpro to javafx.fxml;
    exports slideviewerpro.slideviewerpro;
}