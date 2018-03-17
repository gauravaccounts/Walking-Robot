<?php 
Class Robot 
{
	/*Set property of all direction */
	Public $directionArray = array(1 => "NORTH", 2 => "EAST", 3 => "SOUTH", 4 => "WEST");
	Public $MULTIPLIER_ARRAY = array('MULTIPLIER_1'=>1,'MULTIPLIER_2'=>-1,'MULTIPLIER_3'=>-1,'MULTIPLIER_4'=>-1);
	/*Create method for get walking result */
	Public function Walking($argv)
	{
		 $this->x = $argv[1]; 
		 $this->y = $argv[2];
		 /*Validate the cordinate */
		 if(!is_numeric($this->x) || !is_numeric($this->y))
		 {
		 	echo "Please enter cordinate must be integer.";		 	
		 }
		 else
		 {
		 	$presentDirection = $argv[3];
		 	if($presentDirection !='NORTH' && $presentDirection !='EAST' && $presentDirection !='SOUTH' && $presentDirection !='WEST')
		 	{
		 		echo "Please Enter valid direction.";
		 	}
		 	else
		 	{ 
		 		 $presentDirectionValue = array_search($presentDirection,$this->directionArray);
		 		 $path = $argv[4];
		 		for($i = 0; $i < strlen($path); $i++ ){
							switch($path{$i}){
								case 'R':
									if($presentDirectionValue == 4){
										$presentDirectionValue = 1;
									} else {
										$presentDirectionValue--;
									}
									break;
						                case 'L':
						                        if($presentDirectionValue == 1){
						                                $presentDirectionValue = 4;
						                        } else {
						                                $presentDirectionValue++;
						                        }
						                        break;
						                case 'W':
									if( !($presentDirectionValue % 2) ){
										$this->x += ($path{$i+1} *$this->MULTIPLIER_ARRAY["MULTIPLIER_".$presentDirectionValue]);
									
									} else {
										$this->y += ($path{$i+1} * $this->MULTIPLIER_ARRAY["MULTIPLIER_".$presentDirectionValue]);
									}
									$i++;
						                        break;
								default:
									if(is_numeric($path{$i})){
										echo "\nNumber should be associated with 'W' walk ranging from 0 - 9\n";
									} else {
										echo "\nProvided char '".$path{$i}."' is not valid\n";
									}
									break;
							}
						}

		 	}

		 }
		 echo $this->x." ".$this->y." ".$this->directionArray[$presentDirectionValue];
	}

}
$robotObj = new Robot();
if(count($argv)>=5)
{
	$robotObj->Walking($argv);
}
else
{
	echo "Please Enter Value";
}

?>