<?php
    if(isset($_POST['submitQuiz']))////checking whether the input element is set or not -->
        {
            $a=$_POST['t1']; //use id
            $a1=$_POST['t2']; 
            $a2=$_POST['t3']; 
            $a3=$_POST['t4']; 
            $sum=$a1+$a2+$a3; //total marks
            $avg=$sum/3;
            if($avg>=0&&$avg<=50)
                $grade="Fail";
            if($avg>50&&$avg<=70)
                $grade="C";
            if($avg>70&&$avg<=80)
                $grade="B";
            if($avg>80&&$avg<=90)
                $grade="A";
            if($avg>90)
                $grade="E";
            echo "<br>";
            echo "<font size=4><center>Student is:-".$a."</center><br>"; 
            echo "<font size=4><center>Total marks:-".$sum."</center><br>"; 
            echo "<font size=4><center>Grade is:-".$grade."</center>"; 
        }
?>