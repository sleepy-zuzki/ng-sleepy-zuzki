import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Signal } from '@angular/core';
import { ProjectComponent } from '@components/projects/project/project.component';
import { ApiService } from '@services/api.service';
import { HttpParams } from '@angular/common/http';
import { Datum } from '@core/Interfaces/StrapiResponse';
import { SkeletonComponent } from '@components/projects/project/skeleton/skeleton.component';

@Component({
  selector: 'app-projects',
  imports: [
    ProjectComponent,
    SkeletonComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsComponent implements OnInit {

  projects: Signal<Datum[]>;

  constructor(private apiService: ApiService) {
    this.projects = this.apiService.projects;
  }

  ngOnInit() {
    const httpParams: HttpParams = new HttpParams()
    .set('populate[screenshot][fields][0]', 'formats')
    .set('fields[0]', 'id')
    .set('fields[1]', 'label')
    .set('fields[2]', 'repository')
    .set('fields[3]', 'url')
    .set('populate[techs]', '*');

    this.apiService.fetchProjects(httpParams);
  }

}
