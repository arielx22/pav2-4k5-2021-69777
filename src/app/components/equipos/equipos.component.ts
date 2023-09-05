import { Component, ElementRef, OnInit } from '@angular/core';
import { Equipo } from '../../models/equipo';
import { EquiposService } from '../../services/equipos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent implements OnInit {
  Titulo = 'Equipo';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el Listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  equipos: Equipo[] = null;
  //RegistrosTotal: number;
  //Familias: ArticuloFamilia[] = [];


  //Pagina = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' }
  ];

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;
  submitted = false;


  constructor(
    public formBuilder: FormBuilder,
    private equiposService: EquiposService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
     
    
    this.FormRegistro = this.formBuilder.group({
      Id: [0],
      Nombre: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(40)]
      ],
      Tipo: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(1)]
      ],      
      FechaAlta: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      Activo: [true]
    });

   
  }

  
  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, Id: 0 });
    this.submitted = false;
    console.log(this.AccionABMC);
    //this.FormRegistro.markAsPristine();  // incluido en el reset
    //this.FormRegistro.markAsUntouched(); // incluido en el reset
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.equiposService.get(
    ).subscribe((res: Equipo[]) => {
        this.equipos = res;

      });
  }

  // Obtengo un registro especifico según el Id
  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll

    this.equiposService.getById(Dto.Id).subscribe((res: any) => {
      this.FormRegistro.patchValue(res);

      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = res.FechaAlta.substr(0, 10).split('-');
      this.FormRegistro.controls.FechaAlta.patchValue(
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
      );

      this.AccionABMC = AccionABMC;
    });
  }

  Consultar(Dto) {
    this.BuscarPorId(Dto, 'C');
  }

  // comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(equipo) {
    if (!equipo.Activo) {
      this.modalDialogService.Alert(
        'No puede modificarse un registro Inactivo.'
      );
      return;
    }
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
    this.BuscarPorId(equipo, 'M');
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaAlta.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaAlta = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    /*if (itemCopy.IdEquipo == 0 || itemCopy.IdEquipo == null) {
      itemCopy.IdEquipo = 0;
      this.equiposService
      .post(itemCopy)
      .subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar()});*/

    
    if (this.AccionABMC == "A") {
      this.equiposService
      .post(itemCopy)
      .subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.equiposService
        .put(itemCopy.Id, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        });
    }
  }


 

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  Volver() {
    this.AccionABMC = 'L';
  }


  /*Guardar() {
    this.submitted = true;
    if (this.FormRegistro.errors) {
      return;
    }
    const formCopy = { ...this.FormRegistro.value };
    const arrFecha = formCopy.FechaAlta.toString()
      .substr(0, 10)
      .split('/');
    formCopy.FechaAlta = new Date(
      arrFecha[2],
      arrFecha[1] - 1,
      arrFecha[0]
    ).toISOString();

    if (this.AccionABMC == 'A') {
      this.librosService.post(formCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
    }
  }*/

}