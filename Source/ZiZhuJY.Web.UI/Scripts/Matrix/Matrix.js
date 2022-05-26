(function ($, Matrix) {
    $(document).ready(function () {
        var leftMatrix = [];
        var rightMatrix = [];
        var resultMatrix = [];
        var decimalDigits = -1;

        function readLeftMatrix() {
            var s = $("#taLeftMatrix").val();
            leftMatrix = Matrix.getMatrix(s);
            return leftMatrix;
        }

        function readRightMatrix() {
            var s = $("#taRightMatrix").val();
            rightMatrix = Matrix.getMatrix(s);
            return rightMatrix;
        }

        function computeInverse(m) {
            var inversedMatrix = Matrix.inverse(m);
            resultMatrix = inversedMatrix;
            return resultMatrix;
        }

        function computeTranspose(m) {
            resultMatrix = Matrix.transpose(m);
            return resultMatrix;
        }

        function showResult(m) {
            $("#taResultMatrix").val(Matrix.toString(m, decimalDigits));
            $("#taResultMatrix").trigger("change");
        }

        $("#btnInverse").click(function () {
            readLeftMatrix();
            computeInverse(leftMatrix);
            showResult(resultMatrix);
        });

        $("#btnTranspose").click(function () {
            readLeftMatrix();
            computeTranspose(leftMatrix);
            showResult(resultMatrix);
        });

        $("#btnAdd").click(function () {
            readLeftMatrix();
            readRightMatrix();
            showResult(resultMatrix = Matrix.add(leftMatrix, rightMatrix));
        });

        $("#btnSubtract").click(function () {
            readLeftMatrix();
            readRightMatrix();
            showResult(resultMatrix = Matrix.subtract(leftMatrix, rightMatrix));
        });

        $("#btnMultiply").click(function () {
            readLeftMatrix();
            readRightMatrix();
            showResult(resultMatrix = Matrix.multiply(leftMatrix, rightMatrix));
        });

        $("#taLeftMatrix").keyup(function () {
            var s = $(this).val();
            var m = Matrix.getMatrix(s);
            var pre = Matrix.toString(m);
            if (pre == null) pre = "";
            $("#preLeftMatrix").text(pre);
        });

        $("#taRightMatrix").keyup(function () {
            var s = $(this).val();
            var m = Matrix.getMatrix(s);
            var pre = Matrix.toString(m);
            if (pre == null) pre = "";
            $("#preRightMatrix").text(pre);
        });

        $("#taResultMatrix").change(function () {
            var s = $(this).val();
            var m = Matrix.getMatrix(s);
            var pre = Matrix.toString(m, decimalDigits);
            if (pre == null) pre = "";
            $("#preResultMatrix").text(pre);
        });

        $("#txtDecimalDigits").change(function () {
            var d = parseInt($("#txtDecimalDigits").attr("value"));
            if (d < -1) {
                d = -1;
            }

            decimalDigits = d;
        });

        $("#txtDecimalDigits").trigger("change");
    });
})(jQuery, Matrix);