<?php
  // покупка лицензии
  if (array_key_exists('action',$_GET))
  {
    $n = $_GET['number'];
    $e = $n>4 ? 'й' : ($n<2 ? 'ю' : 'и');
    printf('Пользователь купил %d лицензи%s c ID %d',$n,$e,$_GET['id']);
    exit;
  }

  /**
   * Class LicensePlan
   * @property int $id
   * @property string $name
   * @property int $price
   */
  class LicensePlan
  {
    /**
     * LicensePlan constructor.
     * @param int $id
     * @param string $name
     * @param int $price
     */
    function __construct($id,$name,$price)
    {
      $this->id = $id;
      $this->name = $name;
      $this->price = $price;
    }
    public $id;
    public $name;
    public $price;
  }

  // список планов
  $plans = array(
    new LicensePlan(1,'License Plan #1',13),
    new LicensePlan(2,'License Plan #2',22),
    new LicensePlan(3,'License Plan #3',34)
  );

  sleep(1); // для прелоадера
  header('Content-Type: application/json');
  echo json_encode($plans);